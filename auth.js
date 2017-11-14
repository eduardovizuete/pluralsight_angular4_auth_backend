var User = require('./models/User.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();

router.post('/register', (req, res) => {
  console.log(req.body);
  var userData = req.body;

  var user = new User(userData);

  user.save((err, result) => {
    if (err) console.log("saving user error", err.message);

    res.sendStatus(200);
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

        var payload = {};
        var token = jwt.encode(payload, "123");

        console.log(dataFind.email + ":" + token);
        res.status(200).send({ token });
      })
    }
  })
})

module.exports = router
