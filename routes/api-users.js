const express = require('express');
const router = express.Router();
const User = require('../models/user');

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

router.post('/auth', (req, res, next) => {
    let body = req.body;
    User.auth(body.email, body.password, (err, user) =>{
        if(err) res.json({success: false, msg: 'Error: Database error'});
        else{
            if(user)
                res.json({success:true, msg: 'Valid login information'});
            else
                res.json({success: false, msg: `Error: Invalid email/password`});
        } 
    });
});

module.exports = router;