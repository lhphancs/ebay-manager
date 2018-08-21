const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../util/authenticate');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

function getUserJSON(body){
    return {
        email: body.email,
        password: body.password,
        ebayKey: body.ebayKey,
    };
}

function getNewUser(body){
    return new User(getUserJSON(body));
}

router.post('/add', (req, res, next) => {
    let newUser = getNewUser(req.body);
    User.addUser(newUser, (err, user) => {
        if(err) res.json({success: false, msg: `Failed to add user: ${err.message}`});
        else res.json({success:true, msg: `Successfully added user: ${user}`});
    });
});

router.get('/profile', authenticate, (req, res, next) => {
    res.json(req.user);
});

function handleComparePasswordResponse(isMatch, user, res){
    if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {expiresIn: 604800}); //1 week
        res.json({
            success: true,
            token: `JWT ${token}`,
            user: { id: user._id,email: user.email }
        });
    }
    else{
        res.json({
            success: false,
            msg: 'Wrong password'
        });
    }
}

router.post('/auth', (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail (email, (err, user) => {
        if(err) res.json({success: false, msg: `Database error: ${err.message}`});
        else if(user){
            User.comparePassword(password, user.password, (err, isMatch) =>{
                if(err) res.json({success: false, msg: `Database error: ${err.message}`});
                else handleComparePasswordResponse(isMatch, user, res);
            });
        }
        else
            res.json({success:false, msg:'User Not found'});
        
    });
});

router.get('/fees/:userId', (req, res, next) => {
    User.getFees( req.params.userId, (err, fees) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, fees: fees});
    });
});

router.put('/fees/update', (req, res, next) => {
    User.updateFees( req.body.userId, req.body.newFees, (err, fees) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: fees});
    });
});


router.get('/ship-company/name/:userId/:companyId', (req, res, next) => {
    User.getShipCompanyName( req.params.userId, req.params.companyId, (err, shipCompanyName) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, shipCompanyName: shipCompanyName});
    });
});

router.get('/ship-companies/:userId', (req, res, next) => {
    User.getShipCompanies( req.params.userId, (err, shipCompanies) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, shipCompanies: shipCompanies});
    });
});

router.get('/ship-method/:shipMethodId', (req, res, next) => {
    User.getShipMethod(req.params.shipMethodId, (err, shipMethod) => {
        if(err) res.json({success: false, msg: `Failed to find ship method: ${err.message}`});
        else res.json({success:true, shipMethod:shipMethod});
    });
});
router.post('/ship-method/add', (req, res, next) => {
    let body = req.body;
    User.addShipMethod(body.userId, body.companyId, body.shipMethod, (err, shipMethod) => {
        if(err) res.json({success: false, msg: `Failed to find ship method: ${err.message}`});
        else res.json({success:true, shipMethod:shipMethod});
    });
});

router.put('/ship-method/update', (req, res, next) => {
    User.updateShipMethod(req.body.userId, req.body.companyId, req.body.shipMethodId
        , req.body.shipMethod, (err, shipMethod) => {
            if(err) res.json({success: false, msg: `Failed to find ship method: ${err.message}`});
            else res.json({success:true, shipMethod:shipMethod});
    });
});

router.delete('/ship-method/delete', (req, res, next) => {
    User.deleteShipMethod(req.body.userId, req.body.shipMethodId, (err, shipMethodId) =>{
        if(err) res.json({success: false, msg: `Failed to delete ship method: ${err.message}`});
        else res.json({success:true, shipMethodId:shipMethodId});
    });
});

module.exports = router;