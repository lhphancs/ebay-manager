import os

def getDictUpcToDirName(baseImgDirPath):
    retDict = {}

    listOfDirs = os.listdir(baseImgDirPath)
    for dir in listOfDirs:
        upc = dir.split(',')[-1].strip()
        retDict[upc] = dir
    return retDict