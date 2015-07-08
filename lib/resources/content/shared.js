var api       = require('../../api');
var generate  = require('../generate');

function shared(config) {
  var path = '/shared_items';
  var operations = [];

  var setup = {
    url: config.content.base + path,
    api: 'content',
    get: function get(link, options, cb) {
      options.headers = { BoxApi: 'shared_link=' + link };
      api.execute[this.api]('GET', this.url, {}, options, cb);
    }
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

module.exports = shared;