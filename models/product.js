const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = Schema({
    brand: {type: String, required: true},
    name: {type: String, required: true},
    costPerBox: {type: Number, required: true, min: 0},
    quantityPerBox: {type: Number, required: true, min: 1},
    UPC: {type: String, unique: true, required: true},
    purchasedLocation: {type: String},
    stockNo: {type: String},
    ASINS: {
        type:
        [{ ASIN: { type: String, required: true },
            packAmt: { type: Number, required: true, min: 1, },
            preparation: { type: String} }]
        , default: []
    }
});

const Product = module.exports = mongoose.model('Product', productSchema);

module.exports.getProductByUPC = function(productUPC, callback){
    Product.findOne({UPC: productUPC}, callback);
};

module.exports.getProducts = function(offset, limit, callback){
    Product.find({}, null, {skip:offset, limit: limit}, callback);
};

module.exports.addProduct = function(newProduct, callback){
    newProduct.save(callback);
};

module.exports.addManyProducts = function(newProducts, callback){
    Product.insertMany(newProducts, callback);
};

module.exports.deleteProducts = function(UPCs, callback){
    Product.remove({ UPC: UPCs}, callback);
};

module.exports.updateProduct = function(oldUPC, newProductJSON, callback){
    Product.findOneAndUpdate({UPC: oldUPC}, newProductJSON
        , { new: true, runValidators: true }, callback);
};


//To Delete
module.exports.debugAdd = function(products, callback){
    Product.insertMany(products, callback);
};
//End To Delete