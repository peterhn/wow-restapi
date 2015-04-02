var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//phone: { type: String, index: { unique: true, dropDups: true } },
var AccountSchema = new Schema({
  account_name: { type: String, index: {unique : true, dropDups: true}},
  faction : String,
  link : String,
  characters : []
});

module.exports = mongoose.model('Account', AccountSchema);
