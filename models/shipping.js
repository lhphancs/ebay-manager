const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const constShipping = require('./const/shipping');

const shippingSchema = Schema({
        userId:{type: ObjectId, required: true},
        shipCompany: {type: String, required: true},
        shipMethodName: {type: String, required: true},
        description:{type: String},
        ozPrice: {type:[{
            oz: { type: Number, min: -1 },
            price: { type: Number, required: true, min: 0} }]}
    });
    
const Shipping = module.exports = mongoose.model('Shipping', shippingSchema);

module.exports.addDefaultShippings = function(userId, callback){
    let defaultShippings = constShipping.getDefaultShipMethods(userId);
    Shipping.insertMany(defaultShippings, callback);
};

module.exports.getShipMethod = function(shipMethodId, userId, callback){
    Shipping.findOne({_id:shipMethodId, userId: userId}, (err, shipMethod) =>{
        callback(err, shipMethod);
    });
};

module.exports.getShipMethods = function(userId, callback){
    Shipping.find({userId: userId}, (err, shipMethods) =>{
        callback(err, shipMethods);
    });
};

module.exports.deleteShipMethod = function(shipMethodId, userId, callback){
    Shipping.findOneAndRemove({_id: shipMethodId, userId: userId}, (err, shipMethod) =>{
        callback(err, shipMethod);
    });
};

module.exports.updateShipMethod = function(shipMethodId, userId, newShipMethod, callback){
    Shipping.findOneAndUpdate({_id: shipMethodId, userId:userId}
    , newShipMethod, (err, shipMethod) =>{
        callback(err, shipMethod);
    });
};