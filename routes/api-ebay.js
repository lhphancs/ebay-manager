const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');

function filterItemIds(body){
    console.log(body);
}

function makeEbayRequestsAndHandleResponse(res, ebayAppId){
    let itemIds = getItemIds(ebayAppId);
}

router.post('/listings', (req, res, next) => {
    let userId = req.body.userId;
    User.getEbayInfo(userId, (err, ebayInfo) => {
        if(err) res.json({success: false, msg: err.message});
        else{
            let url = `https://svcs.ebay.com/services/search/FindingService`
                + `/v1?OPERATION-NAME=findItemsIneBayStores`
                + `&SECURITY-APPNAME=${ebayInfo.ebayAppId}`
                + `&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&OutputSelector=ItemID`
                + `&storeName=${ebayInfo.ebayStoreName}&outputSelector=PictureURLLarge`
            request(url, (err, res, body) => {
            if (err) res.json({success: false, msg: err.message});
            else{
                let itemIds = filterItemIds(body)
            }
});
        }
    });
});

module.exports = router;