const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const feeSchema = Schema({
    userId: {type: ObjectId, required: true},
    ebayPercentageFromSaleFee:{type: Number, min:0, default:9.15},
    paypalPercentageFromSaleFee:{ type: Number, min: 0, default: 2.9},
    paypalFlatFee:{ type: Number, min: 0, default: 0.30},
    miscFee:{type:[], default:[]}
});
feeSchema.index({ userId: 1, "fixedShippingInfo.service": 1 }, { unique: true })

const Fee = module.exports = mongoose.model('Fee', feeSchema);

module.exports.addDefaultForNewUser = function(userId, callback){
    newFee = new Fee({userId: userId});
    newFee.save(callback);
};

module.exports.getFeesById = function(userId, callback){
    Fee.findOne({userId: userId}, null, {select:'-userId -_id -__v'}, callback);
};

module.exports.updateFees = function(userId, newFees, callback){
    Fee.findOneAndUpdate({userId: userId}, newFees
        , { new: true, runValidators: true }, callback);
};