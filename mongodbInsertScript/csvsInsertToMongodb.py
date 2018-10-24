import re
import os
import pymongo
import openpyxl
from pathlib import Path
from bson import ObjectId
import copy

'''
Prog will iterate through all sheet in excel file that is placed in 'placeWholesaleExcelFileHere'.
It will parse through the table and insert the desired cols into mongodb.

Desired header names names will be transformed to lowercased alphanumeric value.
    ex) Product No. -> productno
Desired transformed header names must be equal across all csv's.
    ie) The following is fine because they are transformed to the same thing
        File1: Product No.  -> productno
        File2: product no   -> productno
The column order of the header names for a excel file do not matter.

Coder Note:
    At the moment, ship method excel must have columns in certain order. Ie) UPC first col...
'''

def getLoweredAlphaNumericStr(string:str)->str:
    if type(string) is not str:
        return None
    string = re.sub('[^A-Za-z0-9]+', '', string)
    string = str.lower(string)
    return string

#Will remove any non-alphaNumeric character in search
def getColForHeaderName(sheet, headerRow:int, headerName:str)->int:
    max_column = sheet.max_column
    headerNameOfOnlyLetterAndNum = getLoweredAlphaNumericStr(headerName)

    for i in range(1, max_column+1):
        cellVal = sheet.cell(row=headerRow, column=i).value
        if(cellVal == None):
            continue
        headerCellValueOfOnlyLetterAndNum = getLoweredAlphaNumericStr(cellVal)
        if headerCellValueOfOnlyLetterAndNum == None:
            return -1
        if(headerNameOfOnlyLetterAndNum in headerCellValueOfOnlyLetterAndNum):
            return i
    
def getColNumToHeaderNameDict(sheet, headerRow:int, headersToMongoNameDict:dict)->dict:
    colNumToHeaderNameDict = {}
    for headerName in headersToMongoNameDict:
        headerCol = getColForHeaderName(sheet, headerRow, headerName)
        if headerCol == -1:
            continue
        colNumToHeaderNameDict[headerCol] = headerName
    
    return colNumToHeaderNameDict

'''
Returns true if in the form of '$#.##'
ex) isMoneyCellVal('$4.2') == true  isMoneyCellVal('4.2') == false
ex) isMoneyCellVal('$.2') == true  isMoneyCellVal('abc') == false
'''
def isMoneyCellVal(val:str)->bool:
    return val[0] == '$' and eval(val[1:])

def getDictMongoHeaderToCellVal(row:list, headersToMongoNameDict:dict
                          , colNumToHeaderNameDict:dict) ->dict:
    retDict = {}

    i = 1
    for cell in row:
        cellVal = cell.value
        if i in colNumToHeaderNameDict and cellVal != '':
            if isinstance(cellVal, str) and isMoneyCellVal(cellVal):
                cellVal = cellVal[1:] #Trims the '$' in front

            csvHeaderName = colNumToHeaderNameDict[i]
            mongoDbName = headersToMongoNameDict[csvHeaderName]
            retDict[mongoDbName] = cellVal
        i = i+1
    return retDict

def getShippingInfo(upcToShippingInfoDict, upc):
    if upc in upcToShippingInfoDict:
        terminateIndex = 0
        shippingInfos = upcToShippingInfoDict[upc]
        for key in sorted(shippingInfos.keys()):
            for i in range(key-1, terminateIndex, -1):
                shippingInfos[i] = copy.deepcopy( shippingInfos[key] )
                shippingInfos[i].pop('ASIN', None)
            terminateIndex = key
        return shippingInfos
    return {}

def addOrModifyPackInfo(packsInfo, packInfoToInsert):
    packAmt = packInfoToInsert['packAmt']
    if packAmt == None:
        return
    packAmt = int(packAmt)

    if packAmt not in packsInfo:
        packsInfo[packAmt] = {}

    if 'ASIN' in packInfoToInsert:
        packsInfo[packAmt]['ASIN'] = packInfoToInsert['ASIN']

def placeProductToInsert(userId:ObjectId, upcToShippingInfoDict:dict, dictOfProdsToInsert:dict, productToInsert:dict, packInfoToInsert:dict, sheetTitle:str):
    if 'packAmt' not in packInfoToInsert:
        return
    if 'UPC' in productToInsert:
        upc = productToInsert['UPC']
        if upc not in dictOfProdsToInsert:
            productToInsert['userId'] = userId
            productToInsert['wholesaleComp'] = sheetTitle
            productToInsert['packsInfo'] = getShippingInfo(upcToShippingInfoDict, upc)
            dictOfProdsToInsert[upc] = productToInsert
        addOrModifyPackInfo(dictOfProdsToInsert[upc]['packsInfo'], packInfoToInsert)
    elif len(productToInsert) > 0:
        print(str.format('UPC not found in: {}', productToInsert) )

def insertAllValidRowsToMongoDb(userId:ObjectId, upcToShippingInfoDict:dict, collection, sheet, headerRow
    , mainHeadersToMongoNameDict:dict, colNumToHeaderNameDict:dict
    , packInfoHeadersToMongoNameDict, packInfoColNumToHeaderNameDict)->None:
    dictOfProdsToInsert = {}

    for row in sheet.iter_rows(row_offset=headerRow):
        productToInsert = getDictMongoHeaderToCellVal(row, mainHeadersToMongoNameDict
                                             , colNumToHeaderNameDict)
        if 'UPC' not in productToInsert or productToInsert['UPC'] == None:
            continue
        packInfoToInsert = getDictMongoHeaderToCellVal(row, packInfoHeadersToMongoNameDict
                                             , packInfoColNumToHeaderNameDict)
        
        placeProductToInsert(userId, upcToShippingInfoDict, dictOfProdsToInsert, productToInsert, packInfoToInsert, sheet.title)
        
    if len(dictOfProdsToInsert) > 0:
        for prodToInsert in dictOfProdsToInsert.values():
            packInfoAsList = []
            packsInfo = prodToInsert['packsInfo']
            for key in sorted(packsInfo.keys()):
                packInfo = packsInfo[key]
                packInfo['packAmt'] = key
                packInfoAsList.append(packInfo)
            prodToInsert['packsInfo'] = packInfoAsList
            try:
                collection.insert_one(prodToInsert)
            except pymongo.errors.DuplicateKeyError as e:
                print(e)
        
def processSheet(userId:ObjectId, prodCollection, sheet, upcToShippingInfoDict:dict, headerRow:int
, mainHeadersToMongoNameDict:dict, packInfoHeadersToMongoNameDict:dict):
    print( str.format('==================== Working on: {} ====================', sheet.title) )
    
    mainColNumToHeaderNameDict = getColNumToHeaderNameDict(sheet, headerRow, mainHeadersToMongoNameDict)
    packInfoColNumToHeaderNameDict = getColNumToHeaderNameDict(sheet, headerRow, packInfoHeadersToMongoNameDict)
    insertAllValidRowsToMongoDb(userId, upcToShippingInfoDict, prodCollection, sheet, headerRow
    , mainHeadersToMongoNameDict, mainColNumToHeaderNameDict
    , packInfoHeadersToMongoNameDict, packInfoColNumToHeaderNameDict)

def getFirstExcelPathFromFolder(folderPath):
    for file in os.listdir(folderPath):
        if file.endswith('xlsx'):
            return os.path.join(folderPath, file)
    return None

def getNameToIdDict(db, userId):
    shipCollection = db['shippings']
    shipNameToIdDict = {}   

    for shipMethod in shipCollection.find({'userId': ObjectId(userId)},{ '_id': 1, 'shipCompanyName':1, 'shipMethodName':1}):
        key = str.format('{} - {}', shipMethod['shipCompanyName'], shipMethod['shipMethodName'])
        shipNameToIdDict[key] = shipMethod['_id']
    return shipNameToIdDict

def addToUpcToShippingInfoDict(upcToShippingInfoDict, shipNameToIdDict, row):
    upc = row[0].value
    if upc != None:
        packAmt = int(row[2].value)
        shipType = row[3].value
        ozWeight = row[4].value
        package = row[5].value
        preparation = row[6].value
        if upc not in upcToShippingInfoDict:
            upcToShippingInfoDict[upc] = {}
        upcToShippingInfoDict[upc][packAmt] = {'shipMethodId':shipNameToIdDict[shipType]
                                                , 'ozWeight':ozWeight, 'package':package, 'preparation':preparation}

def getUpcToShippingInfoDict(shipMethodExcelPath, db, userId):
    upcToShippingInfoDict = {}
    shipNameToIdDict = getNameToIdDict(db, userId)

    if shipMethodExcelPath == None:
        return upcToShippingInfoDict
    wb = openpyxl.load_workbook(shipMethodExcelPath)
    for sheet in wb:
        for row in sheet.iter_rows(row_offset=1):
            addToUpcToShippingInfoDict(upcToShippingInfoDict, shipNameToIdDict, row)

    return upcToShippingInfoDict

def getWholesaleExcelPath(rootFolderName, wholesaleFolderName):
    wholesaleFolderPath = os.path.join(rootFolderName, wholesaleFolderName)
    return getFirstExcelPathFromFolder(wholesaleFolderPath)

def getShipMethodExcelPath(rootFolderName, shipMethodFolderName):
    shipMethodFolderPath = os.path.join(rootFolderName, shipMethodFolderName)
    return getFirstExcelPathFromFolder(shipMethodFolderPath)

def getUserId(db):
    userCollection = db['users']
    while True:
        userEmail = input('Enter existing email: ')
        queryDoc = userCollection.find_one( {'email': userEmail} )
        if queryDoc != None:
            return ObjectId( queryDoc['_id'] )
        print('Invalid email...Try again...')

def promptUserEmailAndIntegrateFiles(db, wholesaleExcelPath, shipMethodExcelPath):
    mainHeadersToMongoNameDict = {'UPC':'UPC', 'product name':'name', 'stock no':'stockNo'
                                   , 'total cost':'costPerBox', 'box amount':'quantityPerBox'}
    packInfoHeadersToMongoNameDict = {'pack':'packAmt', 'ASIN':'ASIN'}   
    userId = getUserId(db)
    upcToShippingInfoDict = getUpcToShippingInfoDict(shipMethodExcelPath, db, userId)
        
    wb = openpyxl.load_workbook(wholesaleExcelPath)
    headerRow = 2
    for sheet in wb:
        processSheet(userId, db['products'], sheet, upcToShippingInfoDict, headerRow, mainHeadersToMongoNameDict, packInfoHeadersToMongoNameDict)
    
if __name__ == '__main__':
    rootFolderName = os.path.dirname(os.path.abspath(__file__))
    wholesaleFolderName = 'placeWholesaleExcelFileHere'
    wholesaleExcelPath = getWholesaleExcelPath(rootFolderName, wholesaleFolderName)
    shipMethodExcelPath = getShipMethodExcelPath(rootFolderName, 'placeShipMethodExcelFileHere')
    if wholesaleExcelPath == None:
        print( str.format('Error: Excel file not found in: {}', wholesaleFolderName) )
    else:
        try: 
            client = pymongo.MongoClient() #This connects to 'localhost', port# 27017 by default
            db = client['inventory-manager']
            print("Connected to mongodb successfully!")
            promptUserEmailAndIntegrateFiles(db, wholesaleExcelPath, shipMethodExcelPath)
        except pymongo.errors.ConnectionFailure as e:
            print(e)
    print('\nProgram terminated...')