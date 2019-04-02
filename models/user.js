var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
   name : String,
   email : String,
   password : String
});

userSchema.methods.createHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
};

userSchema.methods.comPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

userSchema.static('findById', function(id, callback){
    return this.find({id:id}, callback);
});

module.exports = mongoose.model('User',userSchema);