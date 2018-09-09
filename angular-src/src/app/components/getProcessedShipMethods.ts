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