export function getNullValuesObj(keys:string[]){
    let nullValueObj = {};
    for(let key of keys){
        nullValueObj[key] = null;
    }
    return nullValueObj;
}