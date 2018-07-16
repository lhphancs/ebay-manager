const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post('/api/add', (req, res, next) => {
    Product.addProduct(req.body, (err, product) => {
        if(err) res.status(400).send(err.message);
        else res.json(product);
    });
});

module.exports = router;