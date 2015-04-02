// server.js
// setup
// =======================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var wowRepository = require('./wowRepository');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

//ROUTES FOR OUR API
// =======================================================
var router = express.Router();

router.get('/', function(req, res){
  res.json({message: "Welcome to wow rest API"});
});

router.get('/about', function(req,res){
  res.json({author : 'Peter Nguyen', source : 'http://github.com/peterhn/wow-restapi'});
});

// more routes to be added here
router.post('/account', function(req, res){
  console.log('attempting to post account');
  wowRepository.createNewAccount(req, res);
});

router.get('/account', function(req, res){
  wowRepository.getAccounts(req, res);
});

router.get('/account/:account_name', function(req, res){
  wowRepository.getAccount(req,res);
});

router.get('/account/:account_name/characters', function(req, res){
  wowRepository.getCharacters(req, res);
});

router.get('/account/:account_name/characters/:character_name', function(req, res){
  wowRepository.getCharacter(req, res);
});

router.post('/account/:account_name/characters', function(req, res){
  wowRepository.createCharacter(req, res);
});

router.delete('/account/:account_name', function(req, res){
  wowRepository.deleteAccount(req, res);
});

router.delete('/account/:account_name/characters/:character_name', function(req, res){
  wowRepository.deleteCharacter(req, res);
});


//REGISTER ROUTES
//all routes will be prefixed with api

app.use('/api', router);

app.listen(port);
console.log('magic happens on port '  + port);
