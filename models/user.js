var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  name: String,
  email: { type : String , unique : true, required : true, dropDups: true },
  createdAt: Date,
  deactivated: Boolean,
  closedAt: Date,
  isSeller: Boolean,
  isBuyer: Boolean,
  isPromoter: Boolean,
  password: String,
  passwordCleartext: String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    var match = bcrypt.compareSync(password, this.password);
    return match;
};

module.exports = mongoose.model('User', userSchema);
