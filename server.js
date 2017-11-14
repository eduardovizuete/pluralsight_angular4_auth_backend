var express = require('express')
var cors = require('cors')
var bodyParser = require( 'body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var bcrypt = require('bcrypt-nodejs')
var app = express()

var User = require('./models/User.js')

var posts = [
    {message: 'hello'},
    {message: 'hi'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.get('/users', (req, res) => {
    User.find({}, '-pwd -__v', function (err, users) {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        //res.json({users});
        res.send(users)
    });
})

app.get('/profile/:id', (req, res) => {
    console.log(req.params.id)
    User.findById(req.params.id, '-pwd -__v', function (err, user) {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        res.send(user)
    });
})

app.post('/register', (req, res) => {
    console.log(req.body)
    var userData = req.body;

    var user = new User(userData)
    
    user.save((err, result) => {
        if (err)
            console.log('saving user error', err.message)

        res.sendStatus(200)
    })
    
    console.log(userData.email);
})

app.post('/login', (req, res) => {
    console.log(req.body)
    var loginData = req.body;

    User.findOne({email: loginData.email}, function (err, dataFind) {
        if (err) {
            console.log(err)
            return;
        } else {
            if(!dataFind) {
                console.log('Email or Password invalid 1')
                return res.status(401).send({message: "Email or Password invalid"})
            }
            
            bcrypt.compare(loginData.pwd, dataFind.pwd, (err, isMatch) => {
                if (!isMatch){
                    console.log('Email or Password invalid 2')
                    return res.status(401).send({message: "Email or Password invalid"})
                }
                
                var payload = {}
                var token = jwt.encode(payload, '123')

                console.log(dataFind.email + ":" + token)
                res.status(200).send({token})   
            })        
        }  
    })
})

mongoose.connect('mongodb://test:test@ds259105.mlab.com:59105/pssocial', { useMongoClient: true }, (err) =>{
    if(!err)
        console.log('connect to mongo')
})

mongoose.Promise = global.Promise;

app.listen(3000)