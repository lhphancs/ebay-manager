const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = Schema({
    userId: {type: ObjectId, required: true},
    brand: {type: String, required: true},
    name: {type: String, required: true},
    UPC: {type: String, required: true},
    costPerBox: {type: Number, required: true, min: 0},
    quantityPerBox: {type: Number, required: true, min: 1},
    wholesaleComp: {type: String},
    stockNo: {type: String},
    packsInfo: {
        type:
        [{ ASIN: { type: String},
            packAmt: { type: Number, min: 1 },
            shipMethodId:{ type: ObjectId },
            ozWeight:{ type: Number, min: 1 },
            preparation: { type: String} }]
        , default: []
    }
});
productSchema.index({ userId: 1, UPC: 1 }, { unique: true })

const Product = module.exports = mongoose.model('Product', productSchema);

module.exports.addProduct = function(filteredProductJson, callback){
    let newProductEntry = new Product(filteredProductJson);
    newProductEntry.save(callback);
};

module.exports.addManyProducts = function(userId, newProducts, callback){
    newProducts.forEach(item =>{
        item.userId = userId;
    });
    Product.insertMany(newProducts, callback);
};

module.exports.getProductByUPC = function(userId, productUPC, callback){
    Product.findOne({userId: userId, UPC: productUPC}, callback);
};

module.exports.getProducts = function(userId, offset, limit, callback){
    Product.find({userId: userId}, null, {select:'-userId -_id -__v', skip:offset, limit: limit}, callback);
};

module.exports.deleteProducts = function(userId, UPCs, callback){
    Product.remove({ userId: userId, UPC: UPCs}, callback);
};

module.exports.updateProduct = function(userId, oldUPC, newProductJSON, callback){
    Product.findOneAndUpdate({userId: userId, UPC: oldUPC}, newProductJSON
        , { new: true, runValidators: true }, callback);
};

//To Delete
module.exports.debugAdd = function(products, callback){
    Product.insertMany(products, callback);
};
//End To Delete