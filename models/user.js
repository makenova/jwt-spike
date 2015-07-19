var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = {
  name: String,
  password: String,
  admin: Boolean
};

userSchema = new Schema(user);
module.exports = mongoose.model('User', userSchema);
