const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/listings', (req, res, next) => {
    let ebayKey = req.body.ebayKey;
});

module.exports = router;