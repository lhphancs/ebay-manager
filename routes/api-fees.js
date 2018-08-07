const express = require('express');
const router = express.Router();
const Fee = require('../models/fee');

router.get('/userId', (req, res, next) => {
    Fee.getFeeByUserId( req.params.userId, (err, fee) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, fee: fee});
    });
});

module.exports = router;