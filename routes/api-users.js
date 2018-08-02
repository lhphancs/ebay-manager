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

module.exports = router;