export function calculateTotalEbayFee(ebaySellPrice, ebayPercentageFromSaleFee){
    return Math.round((ebaySellPrice * ebayPercentageFromSaleFee*0.01)*100)/100;
}

export function calculateTotalPaypalFee(ebaySellPrice, paypalPercentageFromSaleFee, paypalFlatFee){
    return Math.round((paypalPercentageFromSaleFee * ebaySellPrice * 0.01 + paypalFlatFee)*100)/100;
}

export function calculateProfit(ebaySellPrice, packAmt, costPerSingle, shippingCost
    , totalEbayFee, totalPaypalFee, miscCost){
    let profit = ebaySellPrice - packAmt*costPerSingle - shippingCost - totalEbayFee - totalPaypalFee - miscCost;
    return Math.ceil(profit*100)/100;
}

function getErrMsg(totalProfit, totalProductCost, shipCost){
    let BASE_ERR_MSG = "Err: ";
    let errMsg = BASE_ERR_MSG;
    if(!totalProfit) errMsg += "desiredProfit ";
    if(!totalProductCost) errMsg += "totalProductCost ";
    if(!shipCost) errMsg += "shipId/oz";
    return errMsg == BASE_ERR_MSG ? null : errMsg;
}

export function calculateDesiredProfit(desiredProfitPerSingle, packAmt, costPerSingle, shipCost
    , miscCost, ebayPercentageFromSaleFee, paypalPercentageFromSaleFee, paypalFlatFee){
    let totalDesiredProfit = desiredProfitPerSingle * packAmt;
    let totalProductCost = costPerSingle * packAmt;
    
    let err = getErrMsg(totalDesiredProfit, totalProductCost, shipCost);
    if(err)
        return err;

    return Math.round((totalDesiredProfit + paypalFlatFee
        + totalProductCost + miscCost + shipCost)
        / (1-paypalPercentageFromSaleFee*0.01 - ebayPercentageFromSaleFee*0.01)*100)/100;
}