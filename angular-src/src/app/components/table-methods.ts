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

const CompleteStatusEnum = {"empty":1, "partiallyEmpty":2, "full":3};
function getCompleteStatus(entry){
    let atleastOneIsEmpty = false;
    let atleastOneIsFull = false;

    for(let key in entry){
        if( isBlankValue(entry[key]) )
            atleastOneIsEmpty = true;
        else
            atleastOneIsFull = true;
    }
    if(atleastOneIsEmpty && atleastOneIsFull) return CompleteStatusEnum.partiallyEmpty;
    return atleastOneIsEmpty ? CompleteStatusEnum.empty: CompleteStatusEnum.full;
}

// Returns null if an entry is only partially filled
export function getProcessedEntries(entries:object[]){
    let processedEntries = [];
    for(let i in entries){
        let completeStatus = getCompleteStatus(entries[i]);
        switch(completeStatus){
            case CompleteStatusEnum.empty: break;
            case CompleteStatusEnum.partiallyEmpty: return null;
            case CompleteStatusEnum.full: processedEntries.push(entries[i]); break;
            default: console.log("Error in switch/case 'getProcessedEntries");
        }
    }
    return processedEntries;
}