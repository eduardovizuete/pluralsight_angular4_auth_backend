var User = require('./models/User.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();

router.post('/register', (req, res) => {
  console.log(req.body);
  var userData = req.body;

  var user = new User(userData);

  user.save((err, newUser) => {
    if (err) {
      console.log("Error saving user");
      return res.status(500).send({ message: "Error saving user" });
    }

    createSendToken(res, newUser)
  });

  console.log(userData.email);
});

router.post('/login', (req, res) => {
  console.log(req.body);
  var loginData = req.body;

  User.findOne({ email: loginData.email }, function(err, dataFind) {
    if (err) {
      console.log(err);
      return;
    } else {
      if (!dataFind) {
        console.log("Email or Password invalid 1");
        return res.status(401).send({ message: "Email or Password invalid" });
      }

      bcrypt.compare(loginData.pwd, dataFind.pwd, (err, isMatch) => {
        if (!isMatch) {
          console.log("Email or Password invalid 2");
          return res.status(401).send({ message: "Email or Password invalid" });
        }

        createSendToken(res, dataFind)
      })
    }
  })
})

function createSendToken(res, user) {
  var payload = { sub: user._id };
  var token = jwt.encode(payload, '123');

  console.log(user.email + ":" + token);
  res.status(200).send({ token });
}

var auth = {
  router,
  checkAuthenticated(req, res, next) {
    if (!req.header('authorization'))
        return res.status(401).send({message: 'Unauthorized. Missing Auth Header'})
    
    var token = req.header('authorization').split(' ')[1]

    var payload = jwt.decode(token, '123')

    if (!payload)
        return res.status(401).send({message: 'Unauthorized. Auth Header Invalid'})

    req.userId = payload.sub

    next()
  }
}

module.exports = auth
