const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

router.get('/:userId', (req, res, next) => {
    Shipping.getShipMethods(req.params.userId, (err, shipMethods) => {
        if(err) res.json({success: false, msg: `Failed to get ship methods: ${err.message}`});
        else res.json({success:true, shipMethods:shipMethods, msg: `Success`});
    });
});

module.exports = router;