const express = require('express');
const router = express.Router();
const Product = require('../models/product');

function getFilteredProductJson(newProductJson){
    return {
        brand: newProductJson.brand,
        name: newProductJson.name,
        costPerBox: newProductJson.costPerBox,
        quantityPerBox: newProductJson.quantityPerBox,
        wholesaleComp: newProductJson.wholesaleComp,
        stockNo: newProductJson.stockNo,
        oz: newProductJson.oz,
        UPC: newProductJson.UPC,
        packsInfo: newProductJson.packsInfo
    };
}

router.get('/info/:userId/:UPC', (req, res, next) => {
    Product.getProductByUpc(req.params.userId, req.params.UPC, (err, product) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, product: product});
    });
});

router.get('/:userId/:offset?/:limit?', (req, res, next) => {
    let DEFAULT_OFFSET = 0;
    let DEFAULT_LIMIT = 100;

    let userId = req.params.userId;
    let strOffset = req.params.offset;
    let offset = strOffset ? parseInt(strOffset): DEFAULT_OFFSET;
    let strLimit = req.params.limit;
    let limit = strLimit ? parseInt(strLimit):DEFAULT_LIMIT;

    Product.getProducts(userId, offset, limit, (err, products) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, products: products});
    });
});

router.post('/add', (req, res, next) => {
    let userId = req.body.userId;
    let newProductJson = req.body.newProduct;
    let newProductEntry = getFilteredProductJson(newProductJson);

    newProductEntry.userId = userId;
    Product.addProduct(newProductEntry, (err, product) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: product});
    });
});

router.post('/add-many', (req, res, next) => {
    let userId = req.body.userId;
    let products = req.body.products;
    Product.addManyProducts(userId, products, (err, products) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: products});
    });
});

router.post('/get-many-by-upcs', (req, res, next) => {
    let userId = req.body.userId;
    let upcs = req.body.upcs;
    Product.getManyProductsByUpcs(userId, upcs, (err, products) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, products: products});
    });
});

router.delete('/delete', (req, res, next) => {
    userId = req.body.userId;
    UPCs = req.body.UPCs;
    Product.deleteProducts(userId, UPCs, (err) => {
        if(err) res.json({success: false, msg: err.message});
        else res.json({success:true, msg: UPCs});
    });
});

router.put('/update', (req, res, next) => {
    let userId = req.body.userId;
    let oldUPC = req.body.oldUPC;
    let newProductJson = req.body.newProduct;
    let newProduct = getFilteredProductJson(newProductJson);

    Product.updateProduct(userId, oldUPC, newProduct, (err, updatedProduct) => {
        if(err) res.json({success: false, msg: err.message});
        else if(!updatedProduct) res.json({success:false, msg: `${oldUPC} not found in database`});
        else res.json({success:true, msg: updatedProduct.UPC});
    });
});

module.exports = router;