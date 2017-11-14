var express = require('express')
var cors = require('cors')
var bodyParser = require( 'body-parser')
var mongoose = require('mongoose')
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

mongoose.connect('mongodb://test:test@ds259105.mlab.com:59105/pssocial', { useMongoClient: true }, (err) =>{
    if(!err)
        console.log('connect to mongo')
})

mongoose.Promise = global.Promise;

app.listen(3000)