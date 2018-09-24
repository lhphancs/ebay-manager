const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');
const parseString = require('xml2js').parseString;

const xmlBody = 
    `<?xml version="1.0" encoding="utf-8"?>
    <GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
        <ErrorLanguage>en_US</ErrorLanguage>
        <WarningLevel>High</WarningLevel>
        <ActiveList>
            <Sort>TimeLeft</Sort>
            <Pagination>
                <EntriesPerPage>3</EntriesPerPage>
                <PageNumber>1</PageNumber>
            </Pagination>
        </ActiveList>
        <OutputSelector>ItemID,Title,Quantity,ListingDetails,CurrentPrice,PictureDetails,Variations</OutputSelector>
    </GetMyeBaySellingRequest>`;

//Needed because xml2js abuses array due to unknown schema of xml
function getNonArrayForm(item){
    return Array.isArray(item) ? item[0] : item;
}

function getEbayErrMsg(res, GetMyeBaySellingResponse){
    let Errors = Array.isArray(GetMyeBaySellingResponse.Errors) ? GetMyeBaySellingResponse.Errors[0]: GetMyeBaySellingResponse.Errors;
    let LongMessage = Array.isArray(Errors.LongMessage) ? Errors.LongMessage[0]: Errors.LongMessage;
    res.json({success: false, msg: LongMessage});
}

function getPackAmt(variationStr){
    console.log(variationStr);
    console.log("A");
}

function getProcessedVariations(variationArray){
    retVariations = [];

    for(item of variationArray){
        console.log(item)
        Variation = getNonArrayForm(item);
        
        VariationSpecifics = getNonArrayForm(Variation.VariationSpecifics);
        NameValueList = getNonArrayForm(VariationSpecifics.NameValueList);

        retVariations.push({
            packAmt: getPackAmt( getNonArrayForm(NameValueList.Value) ),
            price: getNonArrayForm(Variation.StartPrice)
        });
    }   
    return retVariations;
}

function handleValidJsonOfListings(res, GetMyeBaySellingResponse){
    let ActiveList = getNonArrayForm(GetMyeBaySellingResponse.ActiveList);
    let ItemArray = getNonArrayForm(ActiveList.ItemArray);
    let Items = ItemArray.Item;
    let listings = [];

    for(item of Items){
        let listing = {};
        listing.title = item.Title;
        listing.itemID = item.ItemID;
        listing.quantity = item.Quantity;

        ListingDetails = getNonArrayForm(item.ListingDetails);
        listing.url = getNonArrayForm(ListingDetails.ViewItemURL);
        
        PictureDetails = getNonArrayForm(item.PictureDetails);
        listing.galleryUrl = getNonArrayForm(PictureDetails.GalleryURL);

        Variations = item.Variations;
        listing.variations = Variations == null ? []: getProcessedVariations( getNonArrayForm(Variations).Variation);

        listings.push(listing);
    }
    console.log("===============")
    console.log(listings);
    res.json({success: true, listings:listings});
}

function handleJsonOfListings(res, ebayKey){
    var xmlHeaders = {
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-CALL-NAME": "GetMyeBaySelling",
        "X-EBAY-API-IAF-TOKEN": ebayKey
    }

    request({
        url: "https://api.ebay.com/ws/api.dll",
        method: "POST",
        headers: {
            "content-type": "application/xml",
            },
            headers: xmlHeaders,
            body: xmlBody
        }, 
        function (err, response, body){

            if(err) res.json({success: false, msg: err});
            else{
                parseString(body, function (err, result) {
                    if(err) res.json({success: false, msg: err});
                    else{
                        result = Array.isArray(result) ? result[0] : result;
                        let GetMyeBaySellingResponse = getNonArrayForm(result.GetMyeBaySellingResponse);

                        let Ack = getNonArrayForm(GetMyeBaySellingResponse.Ack);
                        if(Ack === 'Failure') getEbayErrMsg(res, GetMyeBaySellingResponse);
                        else handleValidJsonOfListings(res, GetMyeBaySellingResponse);
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
            handleJsonOfListings(res, ebayKey);
        }
    });
});

module.exports = router;