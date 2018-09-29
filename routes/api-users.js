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
        ebayAppId: body.ebayAppId,
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

router.patch('/update-ebay-key', (req, res, next) => {
    let userId = req.body.userId;
    let ebayAppId = req.body.ebayAppId;
    User.updateEbayAppId(userId, ebayAppId, (err, user) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: 'eBay key changed'});
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

module.exports = router;