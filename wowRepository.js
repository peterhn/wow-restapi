var mongoose = require('mongoose');
var url = require('url');

mongoose.connect('mongodb://admin:161446pn@ds061248.mongolab.com:61248/heroku_app35308126');

var Account = require('./app/models/account');
var Character = require('./app/models/character');
var CharacterRules = require('./app/rules/characterRules');
var AccountRules = require('./app/rules/accountRules');

exports.createNewAccount = function(req, res){
  var account = new Account();
  var accountLink = 'http://' + req.headers.host + url.parse(req.url).pathname + '/'+ req.body.name;
  account.account_name = req.body.name;
  account.link = accountLink;

  account.save(function(err, result){
    if(err){
      res.send(err);
    }
    else{
      res.json({'account_id' : result.id});
    }
  });
}

exports.getAccounts = function(req, res){
    Account.find(function(err, accounts){
      if(err){
        res.send(err);
      } else{
      res.send({'accounts' : accounts});
      }
    });
};

exports.getAccount = function(req, res){
  Account.findOne(
    {account_name : req.params.account_name},
    function(err, account){
      if(err){
        res.send(err);
      } else {
        if(account != null){
            res.send(account);
        } else{
            res.send({'error' : 'no account found'});
        }
      }
    }
  );
};

exports.createCharacter = function(req, res){
  var character = new Character();
  character.name = req.body.name.toLowerCase();
  character.level = req.body.level.toLowerCase();
  character.race = req.body.race.toLowerCase();
  character.class = req.body.class.toLowerCase();
  character.faction = req.body.faction.toLowerCase();
  character.deleted = false;
  var errors = [];

  var factionError = CharacterRules.verifyFaction(character);
  var classError = CharacterRules.verifyClass(character);
  var levelError = CharacterRules.verifyLevel(character);

  if(factionError)
    errors.push(factionError);
  if(classError)
    errors.push(classError);
  if(levelError)
    errors.push(levelError);

  var accountFactionError = AccountRules.verifyAccountFaction(req, res, character, errors);
};

exports.createCharacterAfterErrorCheck = function(req, res, character, errors){
  if(errors.length == 0){
    Account.findOneAndUpdate(
      {account_name : req.params.account_name, 'characters.name' : {$ne : character.name}},
      {$push : {characters : character}},
      function(err, account){
        if(err){
          res.send(err);
        } else {
          if(account){
            res.send({'success' : 'character created'});
          } else {
            res.send({'error' : 'character already exists'});
          }
        }
      }
    );
  } else {
    res.send({ 'errors' : errors});
  }
};

exports.getCharacter = function(req, res){
  Account.findOne({account_name : req.params.account_name},
    {characters : {$elemMatch : { name : req.params.character_name}}},
  function(err, result){
      if(err){
        res.send(err);
      } else {
        res.send(result);
      }
  });
};

exports.getCharacters = function(req, res){
  Account.findOne({account_name : req.params.account_name}, function(err, account){
    if(err){
      res.send(err);
    } else {
      if(account.characters != null){
      res.send({ 'account_id' : account.id,'characters' : account.characters});
    } else{
      res.send([]);
    }
    }
  });
};

exports.deleteAccount = function(req, res){
  Account.remove({account_name : req.params.account_name}, function(err){
    if(err){
      res.send(err);
    } else {
      res.send({'success' : 'account deleted'});
    }
  });
};

exports.deleteCharacter = function(req, res){
  Account.findOne({account_name : req.params.account_name, 'characters.name' : req.params.character_name }).select('characters.$').exec(function(err, account){
    if(err) return next(err);
    var postDelete = !account.characters[0].deleted;

    // only undelete the character if faction is the same as the account faction
    // or the character is being deleted
    if((!postDelete && (account.characters[0].faction == account.faction || account.faction == null)) || postDelete){
      Account.findOneAndUpdate(
        {account_name : req.params.account_name, characters : {$elemMatch : { name : req.params.character_name}}},
        {'characters.$.deleted' : postDelete },
        function(err, character){
          if(err){
            res.send(err);
          } else {
            AccountRules.setAccountFaction(req.params.account_name);
            if(postDelete){
              res.send({'success' : 'characted deleted'});
            } else{
              res.send({'success' : 'characted undeleted'});
            }
          }
        });
    } else{
      res.send({'error' : 'cannot undelete character, due account faction restriction'});
    }

  });

};
