var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');


module.exports = function(app){
  
  router.get('/', function(req, res, next) {
    res.send('Hello! The API is at http://localhost:3000/api');
  });

  router.post('/authenticate', function(req, res, next){
    User.findOne({name:req.body.name}, function(err, user){
      if (err) return next(err);
      if (!user){
        return res.status(403).send({
          success:false,
          message:'Authentication failed, user not found!'
        });
      }
      if(user.password !== req.body.password){
        return res.status(403).send({
          success:false,
          message:'Authentication failed, wrong password!'
        });
      }
      var token = jwt.sign(user, app.get('superSecret'), {
        expireInMinutes: 1440 // expires in 24 hours
      });
      res.json({
        success: true,
        message: 'Enjoy your token',
        token: token
      });
    });
  });
  
  router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token){
      jwt.verify(token, app.get('superSecret'), function(err, decoded){
        if (err){
          return res.status(403).send({ 
            success: false, 
            message: 'Failed to authenticate token.'
          });
        }
        req.decoded = decoded;
        return next();
      });
    } else{
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  router.get('/api', function(req, res, next) {
    res.json({message: 'API in the hizzy'});
  });

  router.get('/api/users', function(req, res, next) {
    User.find({}, function(err, users){
      res.json(users);
    });
  });
  
  app.use(router);
};
