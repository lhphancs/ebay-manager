const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Shipping = require('./shipping');

const saltRounds = 10;

const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fees: { type:{
             ebayPercentageFromSaleFee:{type: Number, min:0, required:true},
             paypalPercentageFromSaleFee:{ type: Number, min: 0, required:true},
             paypalFlatFee:{ type: Number, min: 0, required:true}
            }
        , default:{ebayPercentageFromSaleFee:9.15, paypalPercentageFromSaleFee: 2.9,
        paypalFlatFee: 0.30}, required: true},
    ebayKey: {type: String, default:""}
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

module.exports.updateEbayKey = function(userId, ebayKey, callback){
    User.findOneAndUpdate({_id: userId}, {ebayKey:ebayKey}, (err, user) =>{
        if(err) callback(err, null);
        else{
            if(user)
                callback(err,user);
            else callback(new Error("userId not found"), null);
        }
    });
};

module.exports.getUser = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'-password -ebayKey -__v'}, callback);
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

module.exports.getFees = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'fees -_id'}, (err, user) =>{
        callback(err, user.fees);
    });
};


module.exports.updateFees = function(userId, newFees, callback){
    User.findOneAndUpdate({_id: userId}, {fees:newFees}
        , { select:'fees -_id', new: true, runValidators: true }, (err, user) =>{
            if(err) callback(err,null);
            else{
                if(user) callback(err, user);
                else callback(new Error("userId not found"), null);
            }
    });
};

module.exports.getEbayKey = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'ebayKey -_id'}, (err, user) =>{
        callback(err, user.ebayKey);
    });
};