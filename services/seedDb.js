var mongoose = require('mongoose');
var config = require('./config');
var User = require('./models/user');

mongoose.connect(config.database);

var user = new User({
  name: 'Sessy Mae',
  password: 'Leia',
  admin: true
});

user.save(function(err){
  if (err) throw err;
  console.log(user.name + 'saved!');
  mongoose.connection.close();
});
