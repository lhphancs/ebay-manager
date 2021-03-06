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
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: {user}});
    });
});

router.patch('/update-password', (req, res, next) => {
    let formValues = req.body.formValues;
    let userId = req.body.userId;
    let oldPassword = formValues.oldPassword;
    let newPassword = formValues.newPassword;
    User.updatePassword(userId, oldPassword, newPassword, (err, user) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: 'Password changed'});
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

//Returns all ebay settings, except key
router.get('/ebay-settings/:userId', (req, res, next) => {
    User.getEbaySettings( req.params.userId, (err, ebaySettings) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, ebaySettings: ebaySettings});
    });
});

router.get('/ebay-fees/:userId', (req, res, next) => {
    User.getEbayFees( req.params.userId, (err, ebayFees) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, ebayFees: ebayFees});
    });
});

router.get('/shopify-fees/:userId', (req, res, next) => {
    User.getShopifyFees( req.params.userId, (err, shopifyFees) => {
        if(err) res.json({success: false, msg: `Failed to grab fee: ${err.message}`});
        else res.json({success:true, shopifyFees: shopifyFees});
    });
});

router.put('/ebay-fees/update', (req, res, next) => {
    User.updateEbayFees( req.body.userId, req.body.newEbayFees, (err) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true});
    });
});

router.put('/shopify-fees/update', (req, res, next) => {
    User.updateShopifyFees( req.body.userId, req.body.newShopifyFees, (err) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true});
    });
});

router.put('/ebay-account-settings/update', (req, res, next) => {
    User.updateEbayAccountSettings( req.body.userId, req.body.newEbayAccountSettings, (err) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true});
    });
});

module.exports = router;