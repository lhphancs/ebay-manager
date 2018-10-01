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
            <EntriesPerPage>20</EntriesPerPage>
        </Pagination>
        
        <OutputSelector>ItemID,Title,PictureDetails,Variations,SellingStatus</OutputSelector>
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

function handleValidJsonOfListings(res, sellerListResponse){
    let listingDict = {};
    let itemArray = sellerListResponse.ItemArray[0].Item;
    for(let item of itemArray){
        if(item.SellingStatus[0].ListingStatus[0] == 'Active'){
            if(item.Variations){
                let imgUrl = item.PictureDetails[0].GalleryURL[0];
                let variations = item.Variations[0].Variation;

                for(let variation of variations){
                    let ebayQuantityLeft = variation.Quantity[0];
                    let upc = variation.VariationProductListingDetails[0].UPC[0];
                    let packAmt = getPackAmt(variation);

                    let newVariation = {ebayQuantityLeft:ebayQuantityLeft, packAmt:packAmt};

                    if(upc in listingDict)
                        listingDict[upc].variation.push(newVariation);
                        
                    else{
                        listingDict[upc] = {
                            imgUrl:imgUrl,
                            variation:[newVariation]
                        }
                    }
                    /*
                    console.log("=====================")
                    console.log('ebayQuantityLeft: ' + ebayQuantityLeft)
                    console.log('upc: ' + upc);
                    console.log('packAmt: ' + packAmt);
                    */
                }
            }
        }
    }
    res.json({success: true, listingDict: listingDict});
}

function handleJsonOfListings(res, ebayKey, ebaySettings){
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
                            handleValidJsonOfListings(res, sellerListResponse);
                        else 
                            handleSellerListResponseErrMsg(res, sellerListResponse);
                    }
                });
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
                    handleJsonOfListings(res, ebayKey, ebaySettings);
                }
            })
        }
    });
})

module.exports = router;