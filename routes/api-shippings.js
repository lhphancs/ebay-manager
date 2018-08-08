const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

router.get('/:userId', (req, res, next) => {
    Shipping.getShippingsById( req.params.userId, (err, shippings) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, shippings: shippings});
    });
});

module.exports = router;