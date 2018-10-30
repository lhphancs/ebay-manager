const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Shipping = require('./shipping');

const saltRounds = 10;

const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    ebaySettings:{
        ebayFees: { type:{
            ebayPercentageFromSaleFee:{type: Number, min:0, required:true},
            paypalPercentageFromSaleFee:{ type: Number, min: 0, required:true},
            paypalFlatFee:{ type: Number, min: 0, required:true}
            }, 
            default:{ebayPercentageFromSaleFee:9.15
                , paypalPercentageFromSaleFee: 2.9
                , paypalFlatFee: 0.30}, required: true
        },
        ebayUserName: {type: String, default:""},
        ebayStoreName: {type: String, default:""},
        ebayAppId: {type: String, default:""},
        ebayKey: {type: String, default:""}
        , required: true
    },
    shopifySettings:{
        shopifyFees: { type:{
            shopifyPercentageFromSaleFee:{ type: Number, min: 0, required:true},
            shopifyFlatFee:{ type: Number, min: 0, required:true}
            },
            default:{
                shopifyPercentageFromSaleFee: 2.9
                , shopifyFlatFee: 0.30
            }, required: true
        }
        , required: true
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(saltRounds, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) callback(err, null);
            else{
                newUser.password = hash;
                newUser.save();
                Shipping.addDefaultShippings(newUser._id, callback);
            }
        });
    })
};

function handleUpdatePassword(user, oldPassword, newPassword, callback){
    User.comparePassword(oldPassword, user.password, (err, isMatch) =>{
        if(err) callback(err);
        else{
            if(isMatch){
                bcrypt.genSalt(saltRounds, (err, salt) =>{
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if(err) callback(err, null);
                        else{
                            user.password = hash;
                            user.save(callback);
                        }
                    });
                });
            }
            else
                callback(new Error("Incorrect old password"), null)
        }
    });
}

module.exports.updatePassword = function(userId, oldPassword, newPassword, callback){
    User.findOne({_id: userId}, (err, user) =>{
        if(err) callback(err, null);
        else{
            if(user)
                handleUpdatePassword(user, oldPassword, newPassword, callback);
            else callback(new Error("userId not found"), null);
        }
    });
};

module.exports.updateEbayFees = function(userId, newEbayFees, callback){
    User.findOneAndUpdate({_id: userId}
        , {$set: { "ebaySettings.ebayFees.ebayPercentageFromSaleFee" : newEbayFees.ebayPercentageFromSaleFee
            , "ebaySettings.ebayFees.paypalPercentageFromSaleFee" : newEbayFees.paypalPercentageFromSaleFee
            , "ebaySettings.ebayFees.paypalFlatFee" : newEbayFees.paypalFlatFee} }
        , (err, user) =>{
        if(err) callback(err, null);
        else{
            if(user)
                callback(err, user);
            else callback(new Error("userId not found"), null);
        }
    });
};

module.exports.updateShopifyFees = function(userId, newShopifyFees, callback){
    User.findOneAndUpdate({_id: userId}
        , {$set: { "shopifySettings.shopifyFees.shopifyPercentageFromSaleFee" : newShopifyFees.shopifyPercentageFromSaleFee
            , "shopifySettings.shopifyFees.shopifyFlatFee" : newShopifyFees.shopifyFlatFee} }
        , (err, user) =>{
        if(err) callback(err, null);
        else{
            if(user)
                callback(err, user);
            else callback(new Error("userId not found"), null);
        }
    });
};

module.exports.updateEbayAccountSettings = function(userId, newEbayAccountSettings, callback){
    User.findOneAndUpdate({_id: userId}
        , {$set: { "ebaySettings.ebayUserName" : newEbayAccountSettings.ebayUserName ? newEbayAccountSettings.ebayUserName : ""
            , "ebaySettings.ebayStoreName" : newEbayAccountSettings.ebayStoreName ? newEbayAccountSettings.ebayStoreName : ""
            , "ebaySettings.ebayAppId" : newEbayAccountSettings.ebayAppId ? newEbayAccountSettings.ebayAppId : ""
            , "ebaySettings.ebayKey" : newEbayAccountSettings.ebayKey ? newEbayAccountSettings.ebayKey : ""} }
        , (err, user) =>{
        if(err) callback(err, null);
        else{
            if(user)
                callback(err, user);
            else callback(new Error("userId not found"), null);
        }
    });
};

module.exports.getUser = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'-password -ebaySettings -__v'}, callback);
};

module.exports.getEbayKey = function(userId, callback){
    User.findOne({_id: userId}, (err, user) =>{
        callback(err, user.ebaySettings.ebayKey);
    });
};

module.exports.getEbaySettings = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'ebaySettings -_id'}, (err, user) =>{
        user.ebaySettings.ebayKey = undefined;
        callback(err, user.ebaySettings);
    });
};

module.exports.getEbayFees = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'ebaySettings.ebayFees -_id'}, (err, user) =>{
        callback(err, user.ebaySettings.ebayFees);
    });
};

module.exports.getShopifySettings = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'shopifySettings -_id'}, (err, user) =>{
        callback(err, user.shopifySettings);
    });
};

module.exports.getUserByEmail  = function(email, callback){
    User.findOne({email: email}, callback);
};

module.exports.comparePassword = function(inputPassword, hashPassword, callback){
    bcrypt.compare(inputPassword, hashPassword, (err, isMatch) => {
        if(err)
            callback(err, null);
        else
            callback(null, isMatch);
    });
}