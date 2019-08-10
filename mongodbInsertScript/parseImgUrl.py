import os

def getDictUpcToDirName(baseImgDirPath):
    retDict = {}

    listOfDirs = os.listdir(baseImgDirPath)
    for entry in listOfDirs:
        path = baseImgDirPath + '/' + entry
        if os.path.isdir(path):
            upc = entry.split(',')[-1].strip()
            listOfFiles = os.listdir(path)
            if len(listOfFiles) > 0:
                retDict[upc] = entry + '/' + listOfFiles[0]
    return retDict

if __name__ == '__main__':
    BASE_IMG_DIR_PATH = './angular-src/src/assets/imgs/wholesale'
    getDictUpcToDirName(BASE_IMG_DIR_PATH)