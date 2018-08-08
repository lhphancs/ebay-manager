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
userSchema.index({ email: 1, "fixedShippingInfo.service": 1 }, { unique: true })

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(saltRounds, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) callback(err, null);
            else{
                newUser.password = hash;
                newUser.save((err, user)=>{
                    if(err) callback(err, null);
                    else{
                        Shipping.addDefaultForNewUser(user._id, (err, shipping)=>{
                            callback(err, user);
                        });
                    }
                });
            }

        });
    })
};

module.exports.getUserById  = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'-password -__v'}, callback);
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

module.exports.getFeesById  = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'fees -_id'}, (err, user) =>{
        callback(err, user.fees);
    });
};


module.exports.updateFeesById = function(userId, newFees, callback){
    User.findOneAndUpdate({_id: userId}, {fees:newFees}
        , { select:'fees -_id', new: true, runValidators: true }, (err, user) =>{
            if(err) callback(err,null);
            else{
                if(user) callback(err, user);
                else callback(new Error("userId not found"), null);
            }
    });
};
