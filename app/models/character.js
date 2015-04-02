var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
  name: { type: String, index: {unique : true, dropDups: true} },
  level : Number,
  race : String,
  class : String,
  faction : String,
  deleted : Boolean
});

module.exports = mongoose.model('Character', CharacterSchema);
