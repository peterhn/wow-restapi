var Character = require('../models/character');

exports.verifyFaction = function(character){
  var err;
  if(character.faction == 'alliance'){
    if(character.race == 'orc' || character.race == 'tauren' || character.race == 'blood elf'){
      err = character.race + ' cannot be on alliance';
    }
  }

  if(character.faction == 'horde'){
    if(character.race == 'human' || character.race == 'gnome' || character.race == 'worgen'){
      err = character.race + ' cannot be on horde';
    }
  }

  return err;
};

exports.verifyClass = function(character){
  var err;
  if(character.class == 'druid'){
    if((character.race != 'tauren') && (character.race != 'worgen')){
      err = character.race + ' cannot be a ' + character.class;
    }
  }
  if(character.class == 'warrior'){
    if(character.race == 'blood elf'){
      err = character.race + ' cannot be a ' + character.class;
    }
  }
  return err;
};

exports.verifyLevel = function(character){
  var err;
  if(character.level > 85)
    err = 'character level too high';
  else if(character.level < 1)
    err = 'character level too low';

  return err;
};
