import re
import csv
import os
import pymongo
import openpyxl
from pathlib import Path
from bson import ObjectId
import copy

'''
Prog will iterate through all csv in the same dir.
It will parse through the table and insert the desired cols into mongodb.

Desired header names names will be transformed to lowercased alphanumeric value.
    ex) Product No. -> productno
Desired transformed header names must be equal across all csv's.
    ie) The following is fine because they are transformed to the same thing
        File1: Product No.  -> productno
        File2: product no   -> productno
The column order of the header names for a csv file do not matter.
'''

class InvalidColNum(Exception):
   pass

def getLoweredAlphaNumericStr(string:str)->str:
    string = re.sub('[^A-Za-z0-9]+', '', string)
    string = str.lower(string)
    return string

#Will remove any non-alphaNumeric character in search
def getColForHeaderName(csvReader, headerName:str)->int:
    headerNameOfOnlyLetterAndNum = getLoweredAlphaNumericStr(headerName)
    headerRowInCsv = next(csvReader)
    i = -1
    for headerCellValue in headerRowInCsv:
        i = i+1
        if(headerCellValue == None):
            continue
        headerCellValueOfOnlyLetterAndNum = getLoweredAlphaNumericStr(headerCellValue)
        if(headerNameOfOnlyLetterAndNum in headerCellValueOfOnlyLetterAndNum):
            return i
    raise InvalidColNum( str.format('{} not found in header', headerName) )

def getcolNumToHeaderNameDict(csvFile, csvReader
                            , headerRow:int, headersToMongoNameDict:dict)->dict:
    colNumToHeaderNameDict = {}
    for headerName in headersToMongoNameDict:
        try:
            csvFile.seek(0)
            for i in range(headerRow):
                next(csvReader)
            headerCol = getColForHeaderName(csvReader, headerName)
            colNumToHeaderNameDict[headerCol] = headerName
        except InvalidColNum as e:
            print(e)
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
    i = -1
    for cellVal in row:
        i = i+1
        if i in colNumToHeaderNameDict and cellVal != '':
            if isMoneyCellVal(cellVal):
                cellVal = cellVal[1:] #Trims the '$' in front

            csvHeaderName = colNumToHeaderNameDict[i]
            mongoDbName = headersToMongoNameDict[csvHeaderName]
            retDict[mongoDbName] = cellVal
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
    packAmt = int(packInfoToInsert['packAmt'])

    if packAmt not in packsInfo:
        packsInfo[packAmt] = {}

    if 'ASIN' in packInfoToInsert:
        packsInfo[packAmt]['ASIN'] = packInfoToInsert['ASIN']
    if 'preparation' in packInfoToInsert:
        packsInfo[packAmt]['preparation'] = packInfoToInsert['preparation']

def placeProductToInsert(upcToShippingInfoDict:dict, dictOfProdsToInsert:dict, productToInsert:dict, packInfoToInsert:dict, baseFileName:str):
    if 'packAmt' not in packInfoToInsert:
        return
    if 'UPC' in productToInsert:
        upc = productToInsert['UPC']
        if upc not in dictOfProdsToInsert:
            productToInsert['userId'] = ObjectId(userId)
            productToInsert['wholesaleComp'] = baseFileName
            productToInsert['packsInfo'] = getShippingInfo(upcToShippingInfoDict, upc)
            dictOfProdsToInsert[upc] = productToInsert
        addOrModifyPackInfo(dictOfProdsToInsert[upc]['packsInfo'], packInfoToInsert)
    elif len(productToInsert) > 0:
        print(str.format('UPC not found in: {}', productToInsert) )

def insertAllValidRowsToMongoDb(userId:str, upcToShippingInfoDict:dict, collection, csvReader
    , baseFileName:str, mainHeadersToMongoNameDict:dict, colNumToHeaderNameDict:dict
    , packInfoHeadersToMongoNameDict, packInfoColNumToHeaderNameDict)->None:
    dictOfProdsToInsert = {}
    for row in csvReader:
        productToInsert = getDictMongoHeaderToCellVal(row, mainHeadersToMongoNameDict
                                             , colNumToHeaderNameDict)

        packInfoToInsert = getDictMongoHeaderToCellVal(row, packInfoHeadersToMongoNameDict
                                             , packInfoColNumToHeaderNameDict)

        placeProductToInsert(upcToShippingInfoDict, dictOfProdsToInsert, productToInsert, packInfoToInsert, baseFileName)
        
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
        
def processFile(userId:str, prodCollection, filePath:str, upcToShippingInfoDict:dict, headerRow:int
, mainHeadersToMongoNameDict:dict, packInfoHeadersToMongoNameDict:dict):
    head, tail = os.path.split(filePath)
    baseFileName = os.path.splitext(tail)[0]
    print('')
    print( str.format('========== Working on: {} ... ==========', tail) )
    
    with open(filePath, "r",) as csvFile:
        csvReader = csv.reader(csvFile, delimiter=',', skipinitialspace=True)
        mainColNumToHeaderNameDict = getcolNumToHeaderNameDict(csvFile, csvReader, headerRow, mainHeadersToMongoNameDict)
        packInfoColNumToHeaderNameDict = getcolNumToHeaderNameDict(csvFile, csvReader, headerRow, packInfoHeadersToMongoNameDict)
        insertAllValidRowsToMongoDb(userId, upcToShippingInfoDict, prodCollection, csvReader, baseFileName
        , mainHeadersToMongoNameDict, mainColNumToHeaderNameDict
        , packInfoHeadersToMongoNameDict, packInfoColNumToHeaderNameDict)

def getShipMethodExcelPath(shipMethodFolderPath):
    for file in os.listdir(shipMethodFolderPath):
        if file.endswith('xlsx'):
            return os.path.join(shipMethodFolderPath, file)
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
        oz = row[4].value
        if upc not in upcToShippingInfoDict:
            upcToShippingInfoDict[upc] = {}
        upcToShippingInfoDict[upc][packAmt] = {'shipMethodId':shipNameToIdDict[shipType], 'oz':oz}

def getUpcToShippingInfoDict(shipMethodFolderPath, db):
    upcToShippingInfoDict = {}
    shipNameToIdDict = getNameToIdDict(db, userId)
    shipMethodExcelPath = getShipMethodExcelPath(shipMethodFolderPath)
    
    if shipMethodExcelPath == None:
        return upcToShippingInfoDict
    wb = openpyxl.load_workbook(shipMethodExcelPath)
    for sheet in wb:
        for row in sheet.iter_rows(row_offset=1):
            addToUpcToShippingInfoDict(upcToShippingInfoDict, shipNameToIdDict, row)

    return upcToShippingInfoDict

        
if __name__ == '__main__':
    mainHeadersToMongoNameDict = {'UPC':'UPC', 'product name':'name', 'stock no':'stockNo'
                                   , 'total cost':'costPerBox', 'box amount':'quantityPerBox'}
    packInfoHeadersToMongoNameDict = {'pack':'packAmt', 'ASIN':'ASIN', 'Prep':'preparation'}
    rootFolderName = os.path.dirname(os.path.abspath(__file__))
    wholesaleCsvsFolderName = 'outputCsvs'
    shipMethodFolderName = 'placeShipMethodExcelFileHere'

    shipMethodFolderPath = os.path.join(rootFolderName, shipMethodFolderName)
    wholesaleCsvsFolderToReadFromPath = os.path.join(rootFolderName, wholesaleCsvsFolderName)
    userId = input('Enter userId: ')
    headerRow = int(input('With row number starting with 0, enter header row number: '))
    try: 
        client = pymongo.MongoClient() #This connects to 'localhost', port# 27017 by default
        db = client['inventory-manager']

        upcToShippingInfoDict = getUpcToShippingInfoDict(shipMethodFolderPath, db)
        
        print("Connected to mongodb successfully!")
        for file in os.listdir(wholesaleCsvsFolderToReadFromPath):
            filePath  = os.path.join(wholesaleCsvsFolderToReadFromPath, file)
            if file.endswith('csv'):
                processFile(userId, db['products'], filePath, upcToShippingInfoDict, headerRow, mainHeadersToMongoNameDict, packInfoHeadersToMongoNameDict)
    except pymongo.errors.ConnectionFailure as e:
        print(e)
    print('\n Program done...')
