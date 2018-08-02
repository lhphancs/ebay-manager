const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const saltRounds = 10;

const Schema = mongoose.Schema;
const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    ebayKey: {type: String},
    siteSettings:{
        
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(saltRounds, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save(callback);
        });
    })
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
