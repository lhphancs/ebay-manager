const express = require('express');
const router = express.Router();
const Product = require('../models/product');

function getProductJSON(body){
    return {
        brand: body.brand,
        subbrand: body.subbrand,
        name: body.name,
        costPerBox: body.costPerBox,
        quantityPerBox: body.quantityPerBox,
        locationPurchased: body.locationPurchased,
        UPC: body.UPC,
        ASINS: body.ASINS
    };
}
function getNewProduct(body){
    return new Product(getProductJSON(body));
}

router.get('/products/:offset/:limit?', (req, res, next) => {
    let DEFAULT_LIMIT = 20;

    let offset = parseInt(req.params.offset);
    let strLimit = req.params.limit;
    let limit = strLimit ? parseInt(strLimit):DEFAULT_LIMIT;

    Product.getProducts(offset, limit, (err, products) => {
        if(err) res.status(400).send(err.message);
        else res.json(products);
    });
});

router.post('/products/add', (req, res, next) => {
    let newProduct = getNewProduct(req.body);
    Product.addProduct(newProduct, (err, product) => {
        if(err) res.status(400).send(err.message);
        else res.json(product);
    });
});

router.delete('/products/delete', (req, res, next) => {
    UPCS = req.body.UPCS;
    Product.deleteProducts(UPCS, (err) => {
        if(err) res.status(400).send(err.message);
        else res.status(200).send(`Deletion successful: ${UPCS}`);
    });
});

router.put('/products/update', (req, res, next) => {
    let oldUPC = req.body.oldUPC;
    let newProductJSON = getNewProduct(req.body.newProduct)
    Product.updateProduct(oldUPC, getProductJSON(newProductJSON), (err, updatedProduct) => {
        if(err) res.status(400).send(err);
        else if(!updatedProduct) res.status(400).send('Old upc not found in database');
        else res.status(200).send(`Update successful: ${updatedProduct}`);
    });
});

module.exports = router;