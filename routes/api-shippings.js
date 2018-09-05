const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

router.get('/:userId', (req, res, next) => {
    Shipping.getShipMethods(req.params.userId, (err, shipMethods) => {
        if(err) res.json({success: false, msg: `Failed to get ship methods: ${err.message}`});
        else res.json({success:true, shipMethods:shipMethods, msg: `Success`});
    });
});

router.delete('/delete', (req, res, next) => {
    userId = req.body.userId;
    shipMethodId = req.body.shipMethodId;
    Shipping.deleteShipMethod(userId, shipMethodId, (err, shipMethod) => {
        if(err || !shipMethod){
            msg = err ? err.message: `Could not find ${shipMethodId}`
            res.json({success: false, msg: `Failed to delete method: ${msg}`});
        }
        else
            res.json({success:true, msg: `Successfully deleted product: ${shipMethodId}`});
    });
});

module.exports = router;