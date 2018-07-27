const express = require('express');
const router = express.Router();
const Product = require('../models/product');

function getProductJSON(body){
    return {
        brand: body.brand,
        name: body.name,
        costPerBox: body.costPerBox,
        quantityPerBox: body.quantityPerBox,
        purchasedLocation: body.purchasedLocation,
        stockNo: body.stockNo,
        UPC: body.UPC,
        ASINS: body.ASINS
    };
}

function getNewProduct(body){
    return new Product(getProductJSON(body));
}

router.get('/products/:offset?/:limit?', (req, res, next) => {
    let DEFAULT_OFFSET = 0;
    let DEFAULT_LIMIT = 100;

    strOffset = req.params.offset;
    let offset = strOffset ? parseInt(strOffset): DEFAULT_OFFSET;
    let strLimit = req.params.limit;
    let limit = strLimit ? parseInt(strLimit):DEFAULT_LIMIT;

    Product.getProducts(offset, limit, (err, products) => {
        if(err) res.json({success: false, msg: `Failed to grab products: ${err.message}`});
        else res.json({success:true, products: products});
    });
});

router.post('/products/add', (req, res, next) => {
    let newProduct = getNewProduct(req.body);
    Product.addProduct(newProduct, (err, product) => {
        if(err) res.json({success: false, msg: `Failed to add product: ${err.message}`});
        else res.json({success:true, msg: `Successfully added product: ${product}`});
    });
});

router.delete('/products/delete', (req, res, next) => {
    UPCs = req.body.UPCs;
    Product.deleteProducts(UPCs, (err) => {
        if(err) res.json({success: false, msg: `Failed to delete product: ${err.message}`});
        else res.json({success:true, msg: `Successfully deleted product: ${UPCs}`});
    });
});

router.put('/products/update', (req, res, next) => {
    let oldUPC = req.body.oldUPC;
    let newProductJSON = getNewProduct(req.body.newProduct)
    Product.updateProduct(oldUPC, getProductJSON(newProductJSON), (err, updatedProduct) => {
        if(err) res.json({success: false, msg: `Failed to update product: ${err.message}`});
        else if(!updatedProduct) res.json({success:false, msg: `Failed to update product: ${oldUPC} not found in database`});
        else res.json({success:true, msg: `Successfully updated product: ${updatedProduct}`});
    });
});

module.exports = router;