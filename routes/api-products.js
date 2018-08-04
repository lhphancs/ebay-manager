const express = require('express');
const router = express.Router();
const Product = require('../models/product');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


function getProductEntryJSON(userId, newProduct){
    return {
        userId: userId,
        brand: newProduct.brand,
        name: newProduct.name,
        costPerBox: newProduct.costPerBox,
        quantityPerBox: newProduct.quantityPerBox,
        purchasedLocation: newProduct.purchasedLocation,
        stockNo: newProduct.stockNo,
        oz: newProduct.oz,
        UPC: newProduct.UPC,
        ASINS: newProduct.ASINS
    };
}

function getNewProductEntry(userId, newProduct){
    return new Product(getProductEntryJSON(userId, newProduct));
}

router.get('/info/:UPC', (req, res, next) => {
    Product.getProductByUPC( req.param('UPC'), (err, product) => {
        if(err) res.json({success: false, msg: `Failed to grab products: ${err.message}`});
        else res.json({success:true, product: product});
    });
});

router.get('/:offset?/:limit?', (req, res, next) => {
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

router.post('/add', (req, res, next) => {
    let userId = req.body.userId;
    let newProduct = req.body.newProduct;
    let productEntry = getNewProductEntry(userId, newProduct);
    Product.addProduct(productEntry, (err, product) => {
        if(err) res.json({success: false, msg: `Failed to add product: ${err.message}`});
        else res.json({success:true, msg: `Successfully added product: ${product}`});
    });
});

router.post('/add-many', (req, res, next) => {
    let userId = req.body.userId;
    let products = req.body.products;
    Product.addManyProducts(userId, products, (err, products) => {
        if(err) res.json({success: false, msg: `Failed to add products: ${err.message}`});
        else res.json({success:true, msg: `Successfully added products: ${products}`});
    });
});

router.delete('/delete', (req, res, next) => {
    UPCs = req.body.UPCs;
    Product.deleteProducts(UPCs, (err) => {
        if(err) res.json({success: false, msg: `Failed to delete product: ${err.message}`});
        else res.json({success:true, msg: `Successfully deleted product: ${UPCs}`});
    });
});

router.put('/update', (req, res, next) => {
    let oldUPC = req.body.oldUPC;
    let newProductJSON = getNewProductEntry(req.body.product)
    Product.updateProduct(oldUPC, getProductEntryJSON(newProductJSON), (err, updatedProduct) => {
        if(err) res.json({success: false, msg: `Failed to update product: ${err.message}`});
        else if(!updatedProduct) res.json({success:false, msg: `Failed to update product: ${oldUPC} not found in database`});
        else res.json({success:true, msg: `Successfully updated product: ${updatedProduct.UPC}`});
    });
});


//To Delete
router.post('/debug-fill', (req, res, next) => {
    let products = [
        {userId:ObjectId('111111111111'), brand: '1', name: '1', costPerBox: 1, quantityPerBox: 1, purchasedLocation: '1'
            , stockNo: '1', oz: 1, UPC: '1', ASINS: []}
        ,{userId:ObjectId('111111111111'), brand: '2', name: '2', costPerBox: 2, quantityPerBox: 2, purchasedLocation: '2'
            , stockNo: '2', oz: 1,UPC: '2', ASINS: []}
        ,{userId:ObjectId('111111111111'), brand: '3', name: '3', costPerBox: 3, quantityPerBox: 3, purchasedLocation: '3'
            , stockNo: '3', oz: 1,UPC: '3', ASINS: []}
        ,{userId:ObjectId('111111111111'), brand: '4', name: '4', costPerBox: 3, quantityPerBox: 4, purchasedLocation: '4'
            , stockNo: '4', oz: 1, UPC: '4', ASINS: []}
    ];
    Product.debugAdd(products, (err, products) => {
        if(err) res.json({success: false, msg: `Failed to add product: ${err.message}`});
        else res.json({success:true, msg: `Successfully added product: ${products}`});
    });
});
//End To Delete

module.exports = router;