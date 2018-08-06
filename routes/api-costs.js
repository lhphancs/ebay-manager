const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

router.get('/userId', (req, res, next) => {
    Cost.getCostByUserId( req.param('userId'), (err, cost) => {
        if(err) res.json({success: false, msg: `Failed to grab cost: ${err.message}`});
        else res.json({success:true, cost: cost});
    });
});

module.exports = router;