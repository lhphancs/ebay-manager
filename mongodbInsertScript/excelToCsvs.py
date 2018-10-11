'''
Converts all sheets from excel file to csv files.
The file to be converted must be in same directory.
'''

import openpyxl
import csv
import os
from pathlib import Path

def convertAllSheetsToCsv(wb, outputFolderPath):
    for sheet in wb:
        fileName = sheet.title + '.csv'
        finalpath = os.path.join(outputFolderPath, fileName)
        with open(finalpath, 'w', newline='') as file:
            writer = csv.writer(file)
            for row in sheet.rows:
                writer.writerow([cell.value for cell in row])

def getExcelPath(rootFolderName, excelDirName):
    excelDirPath = os.path.join(rootFolderName, excelDirName)
    excelPath = None
    for file in os.listdir(excelDirPath):
        if file.endswith('xlsx'):
            excelPath = os.path.join(excelDirPath, file)
            break
    return excelPath

if __name__ == '__main__':
    rootFolderName = os.path.dirname(os.path.abspath(__file__))
    outputFolderName = 'outputCsvs'
    outputFolderPath = os.path.join(rootFolderName, outputFolderName)
    if not os.path.exists(outputFolderPath):
        os.makedirs(outputFolderPath)
    excelPath = getExcelPath(rootFolderName, 'placeWholesaleExcelFileHere')
    if excelPath == None:
        print('Excel file was not found...')
    else:
        print( str.format('Reading {}', excelPath) )
        wb = openpyxl.load_workbook(excelPath)
        convertAllSheetsToCsv(wb, outputFolderPath)
    print('Program terminated...')
