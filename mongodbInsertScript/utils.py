import re

def getLoweredAlphaNumericStr(string:str)->str:
    if type(string) is not str:
        return None
    string = re.sub('[^A-Za-z0-9]+', '', string)
    string = str.lower(string)
    return string

'''
Returns true if in the form of '$#.##'
ex) isMoneyCellVal('$4.2') == true  isMoneyCellVal('4.2') == false
ex) isMoneyCellVal('$.2') == true  isMoneyCellVal('abc') == false
'''
def isMoneyCellVal(val:str)->bool:
    return val[0] == '$' and eval(val[1:])
