const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');

const parseString = require('xml2js').parseString;

function getXmlHeader(ebayKey){
    let xmlHeaders = {
        'X-EBAY-API-SITEID':'0',
        'X-EBAY-API-COMPATIBILITY-LEVEL':'967',
        'X-EBAY-API-CALL-NAME':'GetSellerList',
        'X-EBAY-API-IAF-TOKEN': `${ebayKey}`
    }
    return xmlHeaders;
}
function getXmlRequestBody(ebayUserName){
    let curDate = new Date();
    let pastDate = new Date();
    pastDate.setDate(curDate.getDate()-120);

    let curDateStr = curDate.toISOString();
    let pastDateStr = pastDate.toISOString();

    return `<?xml version="1.0" encoding="utf-8"?>
    <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
        <ErrorLanguage>en_US</ErrorLanguage>
        <WarningLevel>High</WarningLevel>
        <GranularityLevel>Coarse</GranularityLevel>
        <StartTimeFrom>${pastDateStr}</StartTimeFrom>
        <StartTimeTo>${curDateStr}</StartTimeTo>
        <UserID>${ebayUserName}</UserID>
        <IncludeVariations>true</IncludeVariations>
        <Pagination>
            <EntriesPerPage>3</EntriesPerPage>
        </Pagination>
        <OutputSelector>ItemID,Title,PictureDetails,Variations</OutputSelector>
    </GetSellerListRequest>`;
}

function handleSellerListResponseErrMsg(res, sellerListResponse){
    let errors = sellerListResponse.Errors[0];
    let msg = 'SellerListResponse: ' + errors.LongMessage[0];
    res.json({success: false, msg: msg});
}

function handleFindItemsInStoresResponseErrMsg(res, jsonResp){
    let err = jsonResp.errorMessage[0];
    let msg = 'FindItemsInStoresResponse: ' + err.error[0].message[0];
    res.json({success: false, msg: msg});
}

function handleValidJsonOfListings(res, activeItemIds, sellerListResponse){
    console.log(activeItemIds)
    console.log("iiiiiiiiiiiiiiiiiiiiiiii")
    let itemArray = sellerListResponse.ItemArray[0].Item;
    for(let item of itemArray){
        console.log(item)
        console.log('.............................')
        if(item.ItemID[0] in activeItemIds){
            console.log("MSDLFLKSJDF");
            if(item.Variations){
                let variations = item.Variations[0].Variation;
                
                
            }
        }
    }
}
    
function handleJsonOfListings(res, activeItemIds, ebayKey, ebaySettings){
    let body = getXmlRequestBody(ebaySettings.ebayUserName);
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
                            handleValidJsonOfListings(res, activeItemIds, sellerListResponse);
                        else 
                            handleSellerListResponseErrMsg(res, sellerListResponse);
                    }
                });
            }
        });
}

function getUrlToFindActiveListings(ebaySettings, pageNumber){
    return `https://svcs.ebay.com/services/search/FindingService`
    + `/v1?OPERATION-NAME=findItemsIneBayStores`
    + `&SECURITY-APPNAME=${ebaySettings.ebayAppId}`
    + `&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD`
    + `&OutputSelector=ItemID`
    + `&storeName=${ebaySettings.ebayStoreName}`
    + `&paginationInput.pageNumber=${pageNumber}`
}

function filterItemIds(jsonResp){
    let itemIds = [];
    let searchResults = jsonResp.searchResult[0];
    let items = searchResults.item;
    for(item of items)
        itemIds.push(item.itemId[0]);
    return itemIds;
}

function handleGetItemIdsFromEbayStoreAndListings(res, itemIds, ebayKey, jsonResp, ebaySettings){
    if(jsonResp.ack[0] == 'Success'){
        let activeItemIds = filterItemIds(jsonResp);
        handleJsonOfListings(res, itemIds, ebayKey, ebaySettings);
    }
    else
        handleErrMsg(res, sellerListResponse);
}

function addItemIdsAndHandleListing(res, itemIds, pageNumber){
    let url = getUrlToFindActiveListings(ebaySettings, 1);
    request(url, (err, requestRes, body) => {
        if (err) res.json({success: false, msg: err.message});
        else{
            let jsonResp = JSON.parse(body).findItemsIneBayStoresResponse[0];

            console.log(jsonResp.paginationOutput[0].totalPages[0]);
            console.log('####### Count: ' + jsonResp.searchResult[0].item.length)
            if(jsonResp.ack[0] == 'Success')
                handleGetItemIdsFromEbayStoreAndListings(res, itemIds, ebayKey, jsonResp, ebaySettings);
            else
                handleFindItemsInStoresResponseErrMsg(res, jsonResp);
        }
    });
}

router.post('/listings', (req, res, next) => {
    let userId = req.body.userId;
    User.getEbayKey(userId, (err, ebayKey) => {
        if(err) res.json({success: false, msg: err.message});
        else{
            User.getEbaySettings(userId, (err, ebaySettings) => {
                if(err) res.json({success: false, msg: err.message});
                else{
                    let itemIds = [];
                    addItemIdsAndHandleListing(res, itemIds, 0);
                }
            })
        }
    });
})

module.exports = router;