var Account = require('../models/account');
var wowRepository = require('../../wowRepository');

//verifies if the character can be added to the account
exports.verifyAccountFaction = function(req, res, character, errors){
  Account.findOne({account_name : req.params.account_name}, function(err, account){
    if(!err && account){
        if(account.characters.length == 0 || account.faction == null){
          account.faction = character.faction;
          account.save();
        } else if((account.faction != character.faction)){
          errors.push('cannot create character, due to account faction restriction');
        }

        wowRepository.createCharacterAfterErrorCheck(req, res, character, errors);
    }

  });
};

//sets the account faction on deletion
exports.setAccountFaction = function(accountName){
  Account.findOne({account_name : accountName}, function(err, account){
    //var accountFaction = account.faction;
    var factionUpdated = false;
    for(i = 0; i < account.characters.length; i++){
      console.log(!account.characters[i].deleted);
      if(!account.characters[i].deleted){
        account.faction = account.characters[i].faction;
        factionUpdated = true;
      }
    }
    if(!factionUpdated)
      account.faction = null;
    account.save();
  });
}
