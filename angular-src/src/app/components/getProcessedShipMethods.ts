function getRenamedShipMethod(shipMethod){
  let newShipMethod = shipMethod;
  newShipMethod.shipMethodId = newShipMethod._id
  delete newShipMethod.__v;
  delete newShipMethod.userId;
  delete newShipMethod._id;
  delete newShipMethod.shipCompanyName;
  return newShipMethod;
}

export function getProcessedShipMethods(shipMethods){
  let companyDict = {};
  let processedShipMethods = [];

  for(let shipMethod of shipMethods){
    let shipCompanyName = shipMethod['shipCompanyName'];
    if( !(shipCompanyName in companyDict) ){
      companyDict[shipCompanyName] = Object.keys(companyDict).length;
      processedShipMethods.push(  { name:shipCompanyName, shipMethods:[] }  );
    }

    processedShipMethods[companyDict[shipCompanyName]].shipMethods.push(getRenamedShipMethod(shipMethod));
  }
  return processedShipMethods;
}

export function initializeShipDicts(dictShipIdToName, dictShipIdAndOzToCost, shipMethods){
  for(let method of shipMethods){
    dictShipIdToName[method._id] = method.shipCompanyName + " - " + method.shipMethodName;
    if(method.isFlatRate)
      dictShipIdAndOzToCost[method._id] = method.flatRatePrice;
    else{
      for(let obj of method.ozPrice)
        dictShipIdAndOzToCost[method._id + obj.oz] = obj.price;
    }
  }
}