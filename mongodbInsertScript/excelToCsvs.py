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
        finalpath = outputFolderPath/fileName
        with open(finalpath, 'w', newline='') as file:
            writer = csv.writer(file)
            for row in sheet.rows:
                writer.writerow([cell.value for cell in row])

if __name__ == '__main__':
    rootFolderName = Path( os.getcwd() )
    outputFolderName = 'outputCsvs'
    outputFolderPath = rootFolderName/outputFolderName
    fileName = input("Enter excel filename w/ extension. ex) 'Wholesale.xlsx': ")
    wb = openpyxl.load_workbook(fileName)
    convertAllSheetsToCsv(wb, outputFolderPath)
