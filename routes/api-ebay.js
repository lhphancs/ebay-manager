const express = require('express');
const router = express.Router();
const User = require('../models/user');
const https = require('https');

function getListings(ebayKey){
    this.options = {
        method: "POST",
        path: "https://api.ebay.com/ws/api.dll",
        headers: {
            "X-EBAY-API-SITEID": "0",
            "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
            "X-EBAY-API-CALL-NAME": "GetMyeBaySelling",
            "X-EBAY-API-IAF-TOKEN": ebayKey
        }
    }
}

router.post('/listings', (req, res, next) => {
    let userId = req.body.userId;
    User.getEbayKey(userId, (err, ebayKey) => {

        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, listings:getListings(ebayKey) });
    });
});

module.exports = router;