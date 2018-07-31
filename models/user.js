const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    ebayKey: {type: String},
    siteSettings:{
        
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback){
    newUser.save(callback);
};