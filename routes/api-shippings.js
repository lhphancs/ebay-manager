const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

router.post('/add', (req, res, next) => {
    let newUser = getNewUser(req.body);
    User.addUser(newUser, (err, user) => {
        if(err) res.json({success: false, msg: `Failed to add user: ${err.message}`});
        else res.json({success:true, msg: `Successfully added user: ${user}`});
    });
});

module.exports = router;