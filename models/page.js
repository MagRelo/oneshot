'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PageSchema = new Schema({
  path: String,
  digest: String,
  birthDate: Date
});

module.exports = mongoose.model('Page', PageSchema);
