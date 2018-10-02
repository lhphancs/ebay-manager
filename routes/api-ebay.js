const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');

const parseString = require('xml2js').parseString;
const ENTRIES_PER_PAGE = 200;

function getXmlHeader(ebayKey){
    let xmlHeaders = {
        'X-EBAY-API-SITEID':'0',
        'X-EBAY-API-COMPATIBILITY-LEVEL':'967',
        'X-EBAY-API-CALL-NAME':'GetSellerList',
        'X-EBAY-API-IAF-TOKEN': `${ebayKey}`
    }
    return xmlHeaders;
}
function getXmlRequestBody(ebayUserName, curDateStr, futureDateStr, pageNum){
    return `<?xml version="1.0" encoding="utf-8"?>
    <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
        <ErrorLanguage>en_US</ErrorLanguage>
        <WarningLevel>High</WarningLevel>
        <GranularityLevel>Coarse</GranularityLevel>
        <EndTimeFrom>${curDateStr}</EndTimeFrom>
        <EndTimeTo>${futureDateStr}</EndTimeTo>
        <UserID>${ebayUserName}</UserID>
        <IncludeVariations>true</IncludeVariations>
        <Pagination>
            <PageNumber>${pageNum}</PageNumber>
            <EntriesPerPage>${ENTRIES_PER_PAGE}</EntriesPerPage>
        </Pagination>
        
        <OutputSelector>ItemID,Title,PictureDetails,Variations,SellingStatus,ViewItemURL</OutputSelector>
    </GetSellerListRequest>`;
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

function handleValidJsonOfListings(res, ebayKey, ebaySettings, listingDict
                                    , pageNum, sellerListResponse){
    let itemArray = sellerListResponse.ItemArray[0].Item;
    for(let item of itemArray){
        if(item.SellingStatus[0].ListingStatus[0] == 'Active'){
            if(item.Variations){
                let listUrl = item.ListingDetails[0].ViewItemURL[0];
                let listTitle = item.Title[0]
                let imgUrl = item.PictureDetails[0].GalleryURL[0];
                let variations = item.Variations[0].Variation;

                for(let variation of variations){
                    let ebaySellPrice = Number(variation.StartPrice[0]._);
                    let ebayQuantityLeft = variation.Quantity[0];
                    let upc = variation.VariationProductListingDetails[0].UPC[0];
                    let packAmt = getPackAmt(variation);

                    if(!(upc in listingDict)){
                        listingDict[upc] = {
                            UPC: upc,
                            listUrl: listUrl,
                            listTitle: listTitle,
                            imgUrl:imgUrl,
                            variation:{}
                        }
                    }
                    listingDict[upc].variation[packAmt] = {packAmt: packAmt, ebayQuantityLeft:ebayQuantityLeft
                                                            , ebaySellPrice: ebaySellPrice};
                }
            }
        }
    }
    if(itemArray.length == ENTRIES_PER_PAGE)
        handleJsonOfListings(res, curDateStr, futureDateStr, ebayKey, ebaySettings, listingDict, pageNum+1)
    else
        res.json({success: true, listingDict: listingDict});
}

function handleJsonOfListings(res, curDateStr, futureDateStr, ebayKey, ebaySettings, listingDict, pageNum){
    let body = getXmlRequestBody(ebaySettings.ebayUserName, curDateStr, futureDateStr, pageNum);
    request({
        url: "https://api.ebay.com/ws/api.dll",
        method: "POST",
        headers: {
            "content-type": "application/xml",
            },
            headers: getXmlHeader(ebayKey),
            body: body
        }, 
        function (err, response, body){
            if(err) res.json({success: false, msg: err.message});
            else{
                parseString(body, function (err, result) {
                    let sellerListResponse = result.GetSellerListResponse;
                    if(err) res.json({success: false, msg: err});
                    else{
                        let ack = sellerListResponse.Ack[0];
                        if(ack === 'Success')
                            handleValidJsonOfListings(res, ebayKey, ebaySettings, listingDict
                                , pageNum, sellerListResponse);
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
                    handleJsonOfListings(res, strDates.curDateStr, strDates.futureDateStr
                        , ebayKey, ebaySettings, listingDict, 1);
                }
            })
        }
    });
})

module.exports = router;