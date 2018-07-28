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

router.get('/products/info/:UPC', (req, res, next) => {
    Product.getProductByUPC( req.param('UPC'), (err, product) => {
        if(err) res.json({success: false, msg: `Failed to grab products: ${err.message}`});
        else res.json({success:true, product: product});
    });
});

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
    let newProduct = getNewProduct(req.body.product);
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
    let newProductJSON = getNewProduct(req.body.product)
    Product.updateProduct(oldUPC, getProductJSON(newProductJSON), (err, updatedProduct) => {
        if(err) res.json({success: false, msg: `Failed to update product: ${err.message}`});
        else if(!updatedProduct) res.json({success:false, msg: `Failed to update product: ${oldUPC} not found in database`});
        else res.json({success:true, msg: `Successfully updated product: ${updatedProduct.UPC}`});
    });
});


//To Delete
router.post('/products/debug-fill', (req, res, next) => {
    let products = [
        {brand: '1', name: '1', costPerBox: 1, quantityPerBox: 1, purchasedLocation: '1'
            , stockNo: '1', UPC: '1', ASINS: []}
        ,{
        brand: '2', name: '2', costPerBox: 2, quantityPerBox: 2, purchasedLocation: '2'
            , stockNo: '2', UPC: '2', ASINS: []}
        ,{brand: '3', name: '3', costPerBox: 3, quantityPerBox: 3, purchasedLocation: '3'
            , stockNo: '3', UPC: '3', ASINS: []}
        ,{brand: '4', name: '4', costPerBox: 3, quantityPerBox: 4, purchasedLocation: '4'
        , stockNo: '4', UPC: '4', ASINS: []}
    ];
    Product.debugAdd(products, (err, products) => {
        if(err) res.json({success: false, msg: `Failed to add product: ${err.message}`});
        else res.json({success:true, msg: `Successfully added product: ${products}`});
    });
    
});
//End To Delete

module.exports = router;