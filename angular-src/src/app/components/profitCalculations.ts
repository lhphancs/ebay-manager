function getArraySum(numArray){
    let total = 0;
    for(let i=0; i<numArray.length; ++i)
        total += numArray[i];
    return total;
}

export function calculateTotalFee(sellPrice, percentages:number[], flatFees:number[]){
    let totalPercentages = getArraySum(percentages);
    let totalFlatFees = getArraySum(flatFees);
    return Math.round((totalPercentages * sellPrice * 0.01 + totalFlatFees)*100)/100;
}

export function calculateProfit(sellPrice, packAmt, costPerSingle, shippingCost
    , totalFees:number[], miscCost){
    let finalCostOfFees = 0;
    for(let i=0; i<totalFees.length; ++i)
        finalCostOfFees += totalFees[i];
    let profit = sellPrice - packAmt*costPerSingle - shippingCost - finalCostOfFees - miscCost;
    return Math.round(profit*100)/100;
}

function getErrMsg(totalProfit, totalProductCost, shipCost){
    let BASE_ERR_MSG = "Err: ";
    let errMsg = BASE_ERR_MSG;
    if(!totalProductCost) errMsg += "totalProductCost ";
    if(shipCost == undefined) errMsg += "shipId/oz";
    return errMsg == BASE_ERR_MSG ? null : errMsg;
}

export function calculateDesiredSaleValue(desiredProfitPerSingle, packAmt, costPerSingle, shipCost
    , percentages:number[], flatFees:number[], miscCost, isFreeShipping){
    let totalDesiredProfit = desiredProfitPerSingle * packAmt;
    let totalProductCost = costPerSingle * packAmt;
    
    let err = getErrMsg(totalDesiredProfit, totalProductCost, shipCost);
    if(err)
        return err;
    
    let totalFlatFees = getArraySum(flatFees);
    let totalPercentages = getArraySum(percentages);
    totalPercentages *= 0.01;

    //This assume you pay for shipping
    if(isFreeShipping){
        return Math.round(
            ( totalDesiredProfit + shipCost + totalFlatFees + totalProductCost + miscCost)
                / (1-totalPercentages)
            *100)/100;
    }

    //This assumes buyer pays for shipping
    return Math.round(
        ( (totalDesiredProfit + totalFlatFees + totalProductCost + miscCost + shipCost)
            / (1-totalPercentages) - shipCost)
        *100)/100;
}