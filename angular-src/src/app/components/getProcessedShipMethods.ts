import { MatSnackBar } from '@angular/material';

export function getProcessedShipMethods(shipMethods){
    let companyDict = {};
    let processedShipMethods = [];

    for(let shipMethod of shipMethods){
      let shipCompanyName = shipMethod['shipCompanyName'];
      if( !(shipCompanyName in companyDict) ){
        companyDict[shipCompanyName] = Object.keys(companyDict).length;
        processedShipMethods.push(  { name:shipCompanyName, shipMethods:[] }  );
      }

      processedShipMethods[companyDict[shipCompanyName]].shipMethods.push(
        {
          shipMethodId: shipMethod['_id']
          , shipMethodName: shipMethod['shipMethodName']
          , description: shipMethod['description']
          , ozPrice: shipMethod['ozPrice']
        }
      );
    }
    return processedShipMethods;
  }