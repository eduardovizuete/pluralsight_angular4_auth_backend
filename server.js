var express = require('express')
var cors = require('cors')
var bodyParser = require( 'body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple');
var app = express()

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')

app.use(cors())
app.use(bodyParser.json())

app.get('/posts/:id', (req, res) => {
    var author = req.params.id

    Post.find({author}, function (err, posts) {
        if (err) {
            console.error('Error /post/:id',  err)
            res.sendStatus(500)
        }
        res.send(posts)
    })
})

app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body
    postData.author = req.userId

    var post = new Post(postData)

    post.save((err, result) => {
        if (err) {
            console.error("saving post error", err.message);
            return res.status(500).send({message: 'saving post error'})
        }
    
        res.sendStatus(200);
      });
})


app.get('/users', auth.checkAuthenticated, (req, res) => {
    console.log(req.userId)
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

mongoose.connect('mongodb://test:test@ds259105.mlab.com:59105/pssocial', { useMongoClient: true }, (err) =>{
    if(!err)
        console.log('connect to mongo')
})

mongoose.Promise = global.Promise;

app.use('/auth', auth.router)
app.listen(process.env.PORT || 3000)