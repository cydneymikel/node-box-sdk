var api       = require('../../api');
var generate  = require('../generate');

function session(config) {
  var path = '/sessions';
  var operations = ['create', 'delete'];

  var setup = {
    url: config.view.base + path,
    api: 'view'
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

module.exports = session;