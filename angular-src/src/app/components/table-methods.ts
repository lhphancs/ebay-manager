export function getHeaderNames(headers:object[]){
    let headerNames = [];
    headers.forEach(element => {
      headerNames.push(element['name']);
    });
    return headerNames;
}

export function getNullValuesObj(keys:string[]){
    let nullValueObj = {};
    for(let key of keys){
        nullValueObj[key] = null;
    }
    return nullValueObj;
}

function isBlankValue(value){
    if(value == null) return true;
    if(typeof(value) == "number") return false;
    return value.trim() == "";
}

function isCompletelyEmpty(entry){
    for(let key in entry)
        if( !isBlankValue(entry[key]) )
            return false;
    return true;
}

export function getProcessedEntries(entries:object[]){
    let processedEntries = [];
    for(let entry of entries)
        if(!isCompletelyEmpty(entry))
            processedEntries.push(entry);
    return processedEntries;
}

export function getArrayFromDict(dict){
    let arr = [];
    for(let key in dict) 
        arr.push({key: key, val: dict[key]});
    return arr;
}

