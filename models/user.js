const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Fee = require('./fee');

const saltRounds = 10;

const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    ebayKey: {type: String},
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
                        Fee.addNewFee(user._id, (err, fee) => {
                            callback(err, user);
                        });
                    }
                });
            }

        });
    })
};

module.exports.getUserById  = function(userId, callback){
    User.findOne({_id: userId}, {select:'-password'}, callback);
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