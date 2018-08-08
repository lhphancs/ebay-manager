const express = require('express');
const router = express.Router();
const Fee = require('../models/fee');

router.get('/:userId', (req, res, next) => {
    Fee.getFeesById( req.params.userId, (err, fees) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, fees: fees});
    });
});

router.put('/update', (req, res, next) => {
    Fee.updateFees( req.body.userId, req.body.newFees, (err, fees) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, msg: `Successfully updated fees: ${fees}`});
    });
});
module.exports = router;