import re
import csv
import os
import pymongo
from pathlib import Path
from bson import ObjectId

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

def getLoweredAlphaNumericStr(string):
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

def getcolNumToHeaderNameDict(csvFile, csvReader, headerNameToMongoDbNameDict:dict)->dict:
    colNumToHeaderNameDict = {}
    allHeadersFound = True
    for headerName in headerNameToMongoDbNameDict:
        try:
            csvFile.seek(0)
            headerCol = getColForHeaderName(csvReader, headerName)
            colNumToHeaderNameDict[headerCol] = headerName
        except InvalidColNum as e:
            isSuccess = False
            print(e)
    if allHeadersFound:
        return colNumToHeaderNameDict
    else:
        return None

'''
Returns true if in the form of '$#.##'
ex) isMoneyCellVal('$4.2') == true  isMoneyCellVal('4.2') == false
ex) isMoneyCellVal('$.2') == true  isMoneyCellVal('abc') == false
'''
def isMoneyCellVal(val)->bool:
    return val[0] == '$' and eval(val[1:])

def getProductToInsert(collection, row, headerNameToMongoDbNameDict:dict
                          , colNumToHeaderNameDict:dict) ->dict:
    retDict = {}
    i = -1
    for cellVal in row:
        i = i+1
        if i in colNumToHeaderNameDict and cellVal != '':
            if isMoneyCellVal(cellVal):
                cellVal = cellVal[1:] #Trims the '$' in front

            csvHeaderName = colNumToHeaderNameDict[i]
            mongoDbName = headerNameToMongoDbNameDict[csvHeaderName]
            retDict[mongoDbName] = cellVal
    return retDict

def insertAllValidRowsToMongoDb(userId, collection, csvReader, baseFileName, headerNameToMongoDbNameDict:dict
                                , colNumToHeaderNameDict:dict)->None:
    listToInsert = []
    for row in csvReader:
        productToInsert = getProductToInsert(collection, row, headerNameToMongoDbNameDict
                                             , colNumToHeaderNameDict)
        
        try:
            if len(productToInsert) > 0:
                productToInsert['userId'] = ObjectId(userId)
                productToInsert['wholesaleComp'] = baseFileName
                productToInsert['brand'] = 'tempBrand' ################
                listToInsert.append(productToInsert)  
        except pymongo.errors.DuplicateKeyError as e:
            print(e)
    if len(listToInsert) > 0:
        collection.insert_many(listToInsert)
            
def processFile(userId, collection, filePath, headerNameToMongoDbNameDict:dict):
    head, tail = os.path.split(filePath)
    baseFileName = os.path.splitext(tail)[0]
    print('')
    print( str.format('========== Working on: {} ... ==========', tail) )
    
    with open(filePath, "r",) as csvFile:
        csvReader = csv.reader(csvFile, delimiter=',', skipinitialspace=True)
        colNumToHeaderNameDict = getcolNumToHeaderNameDict(csvFile, csvReader, headerNameToMongoDbNameDict)
        if(colNumToHeaderNameDict != None):
            insertAllValidRowsToMongoDb(userId, collection, csvReader, baseFileName, headerNameToMongoDbNameDict, colNumToHeaderNameDict)
        
if __name__ == '__main__':
    headerNameToMongoDbNameDict = {'UPC':'UPC', 'product name':'name', 'stock no':'stockNo'
                                   , 'total cost':'costPerBox', 'box amount':'quantityPerBox'}
    rootFolderName = Path( os.getcwd() )
    csvsFolderName = 'outputCsvs'
    folderToReadFromPath = rootFolderName/csvsFolderName
    userId = input('Enter userId: ')
    try: 
        client = pymongo.MongoClient() #This connects to 'localhost', port# 27017 by default
        db = client['inventory-manager']
        collection = db['products']
        print("Connected to mongodb successfully!")
        for file in os.listdir(folderToReadFromPath):
            filePath  = folderToReadFromPath/file
            if file.endswith('csv'):
                processFile(userId, collection, filePath, headerNameToMongoDbNameDict)
    except pymongo.errors.ConnectionFailure as e:
        print(e)
    print('\n Program done...')
