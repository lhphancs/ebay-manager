const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');
const async = require('async');

const parseString = require('xml2js').parseString;
const ENTRIES_PER_PAGE = 200;

function getSellerListXmlRequestBody(ebayUserName, curDateStr, futureDateStr, pageNum){
    return `<?xml version="1.0" encoding="utf-8"?>
    <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
        <ErrorLanguage>en_US</ErrorLanguage>
        <WarningLevel>High</WarningLevel>
        <DetailLevel>ItemReturnDescription</DetailLevel>
        <EndTimeFrom>${curDateStr}</EndTimeFrom>
        <EndTimeTo>${futureDateStr}</EndTimeTo>
        <UserID>${ebayUserName}</UserID>
        <IncludeVariations>true</IncludeVariations>
        <Pagination>
            <PageNumber>${pageNum}</PageNumber>
            <EntriesPerPage>${ENTRIES_PER_PAGE}</EntriesPerPage>
        </Pagination>
        
        <OutputSelector>ItemID,Title,PictureDetails,Variations,SellingStatus,ViewItemURL,PaginationResult,ShippingDetails</OutputSelector>
    </GetSellerListRequest>`;
}

function getXmlHeader(ebayKey, callName){
    let xmlHeaders = {
        'X-EBAY-API-SITEID':'0',
        'X-EBAY-API-COMPATIBILITY-LEVEL':'967',
        'X-EBAY-API-CALL-NAME':`${callName}`,
        'X-EBAY-API-IAF-TOKEN': `${ebayKey}`
    }
    return xmlHeaders;
}

function getMultipleItemsRequestUrls(arrayOfMaxItemIdsStrs, ebaySettings){
    let ebayAppId = ebaySettings.ebayAppId;

    let retUrls = [];
    for(let i=0; i<arrayOfMaxItemIdsStrs.length; ++i){
        let itemIdsStr = arrayOfMaxItemIdsStrs[i];
        let url = `http://open.api.ebay.com/shopping?callname=GetMultipleItems`
        + `&appid=${ebayAppId}`
        + `&siteid=0&version=897`
        + `&ItemID=${itemIdsStr}`
        + `&IncludeSelector=Details,ItemSpecifics,ShippingCosts`
        + `&responseencoding=JSON`;
        retUrls.push(url);
    }
    return retUrls;
}

function handleSellerListResponseErrMsg(res, sellerListResponse){
    let errors = sellerListResponse.Errors[0];
    let msg = 'SellerListResponse: ' + errors.LongMessage[0];
    res.json({success: false, msg: msg});
}

function strIsInteger(str){
    return /^\d+$/.test(str);
}

function getPackAmt(variation){
    let variationSpecifics = variation.VariationSpecifics[0];
    let nameValueList = variationSpecifics.NameValueList;

    for(let nameValue of nameValueList){
        let value = nameValue.Value[0];
        let words = value.split(" ");
    
        for(let word of words){
            if( strIsInteger(word) )
                return Number(word);            
        }
    }
    return undefined;
}

function addToListingDictForVariationListing(item, listingDict){
    let listUrl = item.ListingDetails[0].ViewItemURL[0];
    let listTitle = item.Title[0]
    let imgUrl = item.PictureDetails[0].GalleryURL[0];

    //Find out shipping details. Will assume only take first shipping option.
    let shippingDetails = item.ShippingDetails[0];
    let shippingServiceOptions = shippingDetails.ShippingServiceOptions[0]; //Grab first shipping option
    let isFreeShipping = shippingServiceOptions.FreeShipping[0] == 'true';
    let variations = item.Variations[0].Variation;

    for(let variation of variations){
        let ebaySellPrice = Number(variation.StartPrice[0]._);
        let ebayQuantity = variation.Quantity[0]; //IMPORTANT! ebayDefines this as 'amtSold' + 'amtAvailable'
        let sellingStatus = variation.SellingStatus[0];
        let ebayQuantitySold = sellingStatus.QuantitySold[0];
        let ebayQuantityLeft = ebayQuantity - ebayQuantitySold;

        let upc = variation.VariationProductListingDetails[0].UPC[0];
        let packAmt = getPackAmt(variation);

        if(!(upc in listingDict)){
            listingDict[upc] = {
                UPC: upc,
                listUrl: listUrl,
                listTitle: listTitle,
                imgUrl: imgUrl,
                isFreeShipping: isFreeShipping,
                variation: {}
            }
        }
        listingDict[upc].variation[packAmt] = {packAmt: packAmt, ebayQuantityLeft:ebayQuantityLeft
                                                , ebaySellPrice: ebaySellPrice};
    }
}

function getLastEbayPage(sellerListResponse){
    let paginationResult = sellerListResponse.PaginationResult[0]
    return paginationResult.TotalNumberOfPages[0];
}

function getConcatenatedItemIdsStr(nonVariationItemIds, startIndex, lastIndex){
    let retStr = '';
    for(let i=startIndex; i<=lastIndex; ++i)
        retStr += nonVariationItemIds[i] + ',';
    retStr = retStr.substring(0, retStr.length - 1);
    return retStr;
}

function getArrayOfMaxItemIdsStrs(nonVariationItemIds, maxItemIds){
    let arrayOfMaxItemIdsStrs = [];
    for(let i=0; i<nonVariationItemIds.length; i+=maxItemIds){
        let iMaxIndex = i + maxItemIds - 1;
        let iLastIndex = iMaxIndex <= nonVariationItemIds.length - 1
            ? iMaxIndex : nonVariationItemIds.length - 1;
        let concatItemIdsStr = getConcatenatedItemIdsStr(nonVariationItemIds, i, iLastIndex)
        arrayOfMaxItemIdsStrs.push(concatItemIdsStr);
    }
    return arrayOfMaxItemIdsStrs;
}

function getMultipleItemsRequest(requestUrls, callback){
    request(requestUrls, (err, res, body) => {
        if (err) console.log(err.message);
        else{
            callback(err, body);
        }
    });
}

function getUpcFromNonVariationItem(item){
    let itemSpecifics = item.ItemSpecifics;
    let nameValueList = itemSpecifics.NameValueList;
    for(let nameValue of nameValueList){
        if(nameValue.Name == 'UPC')
            return nameValue.Value[0];
    }
    return undefined;
}

function parseItemAndAddToListingDict(item, listingDict){
    let data = {nonVariation: true};
    data.listTitle = item.Title;
    data.listUrl = item.ViewItemURLForNaturalSearch;
    data.imgUrl = item.PictureURL[0];

    let currentPrice = item.CurrentPrice.Value;
    let quantity = item.Quantity; //IMPORTANT! ebayDefines this as 'amtSold' + 'amtAvailable'
    let quantitySold = item.QuantitySold;
    let quantityLeft = quantity - quantitySold;
    data.variation = {};
    data.variation[1] = {packAmt: 1, ebayQuantityLeft:quantityLeft
        , ebaySellPrice: currentPrice};

    let upc = getUpcFromNonVariationItem(item)
    data.UPC = upc;
    
    let shippingCostSummary = item.ShippingCostSummary;
    let shippingType = shippingCostSummary.ShippingType;
    data.isFreeShipping = shippingType != 'Calculated';

    listingDict[upc] = data;
}

function addNonVariationToListingDict(responses, listingDict){
    for(let response of responses){
        jsonResponse = JSON.parse(response);
        
        let items = jsonResponse.Item;
        for(let item of items)
            parseItemAndAddToListingDict(item, listingDict);
    }
}

function handleValidJsonOfListings(res, curDateStr, futureDateStr, ebayKey, ebaySettings, listingDict
, nonVariationItemIds, pageNum, lastEbayPage, sellerListResponse){
    let itemArray = sellerListResponse.ItemArray[0].Item;
    for(let item of itemArray){
        if(item.SellingStatus[0].ListingStatus[0] == 'Active'){
            if(item.Variations)
                addToListingDictForVariationListing(item, listingDict);
            else
                nonVariationItemIds.push(item.ItemID[0]);
        }
    }
    if(pageNum == lastEbayPage){
        if(nonVariationItemIds.length > 0){
            const maxItemIds = 20; // This is the max itemIds that eBay allows per request
            let arrayOfMaxItemIdsStrs = getArrayOfMaxItemIdsStrs(nonVariationItemIds, maxItemIds);
            let requestUrls = getMultipleItemsRequestUrls(arrayOfMaxItemIdsStrs, ebaySettings)
            async.map(requestUrls, getMultipleItemsRequest, function(err, responses){
                if (err)
                    return console.log(err);
                else{
                    addNonVariationToListingDict(responses, listingDict);
                    res.json({success: true, listingDict: listingDict});
                }
            });
        }
    }  
    else
        handleJsonOfListings(res, curDateStr
            , futureDateStr, ebayKey, ebaySettings
            , listingDict, nonVariationItemIds, pageNum+1)
}

function handleJsonOfListings(res, curDateStr, futureDateStr, ebayKey
, ebaySettings, listingDict, nonVariationItemIds, pageNum){
    let body = getSellerListXmlRequestBody(ebaySettings.ebayUserName, curDateStr, futureDateStr, pageNum);
    request({
        url: "https://api.ebay.com/ws/api.dll",
        method: "POST",
        headers: {
            "content-type": "application/xml",
            },
        headers: getXmlHeader(ebayKey, 'GetSellerList'),
        body: body
    }, 
    function (err, response, body){
        if(err) res.json({success: false, msg: err.message});
        else{
            parseString(body, function (err, result) {
                if(err) res.json({success: false, msg: err});
                else{
                    let sellerListResponse = result.GetSellerListResponse;
                    let ack = sellerListResponse.Ack[0];
                    
                    if(ack === 'Success'){
                        let lastEbayPage = getLastEbayPage(sellerListResponse);
                        handleValidJsonOfListings(res, curDateStr, futureDateStr, ebayKey, ebaySettings, listingDict, nonVariationItemIds
                            , pageNum, lastEbayPage, sellerListResponse);
                    }
                    else 
                        handleSellerListResponseErrMsg(res, sellerListResponse);
                }
            });
        }
    });
}

function getStrDateNowAndDate30DaysInFuture(){
    let curDate = new Date();
    let futureDate = new Date();
    futureDate.setDate(curDate.getDate()+30);

    return {curDateStr:curDate.toISOString(), futureDateStr:futureDate.toISOString()};
}

router.post('/listings', (req, res, next) => {
    let userId = req.body.userId;
    User.getEbayKey(userId, (err, ebayKey) => {
        if(err) res.json({success: false, msg: err.message});
        else{
            User.getEbaySettings(userId, (err, ebaySettings) => {
                if(err) res.json({success: false, msg: err.message});
                else{
                    let listingDict = {};
                    let strDates = getStrDateNowAndDate30DaysInFuture();
                    let nonVariationItemIds = [];
                    handleJsonOfListings(res, strDates.curDateStr, strDates.futureDateStr
                        , ebayKey, ebaySettings, listingDict, nonVariationItemIds, 1);
                }
            });
        }
    });
})

module.exports = router;