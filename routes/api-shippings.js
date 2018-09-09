const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

router.get('/shipCompanyName/:shipMethodId/:userId', (req, res, next) => {
    shipMethodId = req.params.shipMethodId;
    userId = req.params.userId;
    
    Shipping.getShipCompanyName(shipMethodId, userId, (err, shipCompanyName) => {
        if(err || !shipCompanyName){
            msg = err ? err.message: `Could not find ${shipMethodId}`
            res.json({success: false, msg: msg});
        }
        else res.json({success:true, shipCompanyName:shipCompanyName, msg: `Success`});
    });
});

router.get('/shipMethod/:shipMethodId/:userId', (req, res, next) => {
    shipMethodId = req.params.shipMethodId;
    userId = req.params.userId;
    
    Shipping.getShipMethod(shipMethodId, userId, (err, shipMethod) => {
        if(err || !shipMethod){
            msg = err ? err.message: `Could not find ${shipMethodId}`
            res.json({success: false, msg: msg});
        }
        else res.json({success:true, shipMethod:shipMethod, msg: `Success`});
    });
});

router.get('/all/:userId', (req, res, next) => {
    Shipping.getShipMethods(req.params.userId, (err, shipMethods) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, shipMethods:shipMethods, msg: `Success`});
    });
});

router.delete('/delete', (req, res, next) => {
    userId = req.body.userId;
    shipMethodId = req.body.shipMethodId;
    Shipping.deleteShipMethod(shipMethodId, userId, (err, shipMethod) => {
        if(err || !shipMethod){
            msg = err ? err.message: `Could not find ${shipMethodId}`
            res.json({success: false, msg: msg});
        }
        else
            res.json({success:true, msg: shipMethodId});
    });
});

router.put('/update', (req, res, next) => {
    userId = req.body.userId;
    shipMethodId = req.body.shipMethodId;
    newShipMethod = req.body.newShipMethod;
    Shipping.updateShipMethod(shipMethodId, userId
    , newShipMethod, (err, newShipMethod) => {
        if(err || !newShipMethod){
            msg = err ? err.message: `Could not find ${shipMethodId}`
            res.json({success: false, msg: msg});
        }
        else
            res.json({success:true, msg: shipMethodId});   
    });
});

router.post('/add', (req, res, next) => {
    newShipMethod = req.body.newShipMethod;
    Shipping.addShipMethod(newShipMethod, (err, newShipMethod) => {
        if(err)
            res.json({success: false, msg: err.message});
        else
            res.json({success:true, msg: newShipMethod.shipMethodName});   
    });
});

module.exports = router;