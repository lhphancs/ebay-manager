const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post('/api/add-product', (req, res, next) => {
    Product.addProduct(req.body, (err, product) => {
        if(err) res.status(400).send(err.message);
        else res.json(product);
    });
});

router.delete('/api/delete-products', (req, res, next) => {
    UPCS = req.body.UPCS;
    Product.deleteProducts(UPCS, (err) => {
        if(err) res.status(400).send(err.message);
        else res.status(200).send(`Deletion successful: ${UPCS}`);
    });
});

module.exports = router;