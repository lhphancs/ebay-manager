export function calculateTotalEbayFee(ebaySellPrice, ebayPercentageFromSaleFee){
    return Math.round((ebaySellPrice * ebayPercentageFromSaleFee*0.01)*100)/100;
}

export function calculateTotalPaypalFee(ebaySellPrice, paypalPercentageFromSaleFee, paypalFlatFee){
    return Math.round((paypalPercentageFromSaleFee * ebaySellPrice * 0.01 + paypalFlatFee)*100)/100;
}

export function calculateProfit(ebaySellPrice, packAmt, costPerSingle, shippingCost
    , totalEbayFee, totalPaypalFee, miscCost){
    let profit = ebaySellPrice - packAmt*costPerSingle - shippingCost - totalEbayFee - totalPaypalFee - miscCost;
    return Math.round(profit*100)/100;
}

function getErrMsg(totalProfit, totalProductCost, shipCost){
    let BASE_ERR_MSG = "Err: ";
    let errMsg = BASE_ERR_MSG;
    if(!totalProfit) errMsg += "desiredProfit ";
    if(!totalProductCost) errMsg += "totalProductCost ";
    if(shipCost == undefined) errMsg += "shipId/oz";
    return errMsg == BASE_ERR_MSG ? null : errMsg;
}

export function calculateDesiredSaleValue(desiredProfitPerSingle, packAmt, costPerSingle, shipCost
    , miscCost, ebayPercentageFromSaleFee, paypalPercentageFromSaleFee, paypalFlatFee, isFreeShipping){
    let totalDesiredProfit = desiredProfitPerSingle * packAmt;
    let totalProductCost = costPerSingle * packAmt;
    
    let err = getErrMsg(totalDesiredProfit, totalProductCost, shipCost);
    if(err)
        return err;

    //This assume you pay for shipping
    if(isFreeShipping)
        return Math.round(
            ( totalDesiredProfit + paypalFlatFee + totalProductCost + miscCost + shipCost)
                / (1-paypalPercentageFromSaleFee*0.01 - ebayPercentageFromSaleFee*0.01
            )
            *100)/100;

    //This assumes buyer pays for shipping
    return Math.round(
        ( (totalDesiredProfit + paypalFlatFee + totalProductCost + miscCost + shipCost)
            / (1-paypalPercentageFromSaleFee*0.01 - ebayPercentageFromSaleFee*0.01) - shipCost)
        *100)/100;
}