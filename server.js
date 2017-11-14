var express = require('express')
var cors = require('cors')
var bodyParser = require( 'body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
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

app.post('/register', (req, res) => {
    console.log(req.body)
    var userData = req.body;

    var user = new User(userData)
    
    user.save((err, result) => {
        if (err)
            console.log('saving user error')

        res.sendStatus(200)
    })
    
    console.log(userData.email);
})

app.post('/login', (req, res) => {
    console.log(req.body)
    var userData = req.body;

    User.findOne({email: userData.email}, function (err, dataFind) {
        if (err) {
            console.log(err)
            return;
        } else {
            if(!dataFind) {
                console.log('Email or Password invalid 1')
                return res.status(401).send({message: "Email or Password invalid"})
            } else if (userData.pwd != dataFind.pwd) {
                console.log('Email or Password invalid 2')
                return res.status(401).send({message: "Email or Password invalid"})
            } else {
                var payload = {}
                var token = jwt.encode(payload, '123')

                console.log(dataFind.email + ":" + token)
                res.status(200).send({token})
            }       
        }  
    })
})

mongoose.connect('mongodb://test:test@ds259105.mlab.com:59105/pssocial', { useMongoClient: true }, (err) =>{
    if(!err)
        console.log('connect to mongo')
})

mongoose.Promise = global.Promise;

app.listen(3000)