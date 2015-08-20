var api       = require('../../api');
var generate  = require('../generate');

function folder(config) {
  var path = '/folders';
  var operations = ['create', 'get', 'update', 'delete', 'copy', 'destroy', 'restore', 'share', 'trash'];

  var setup = {
    url: config.content.base + path,
    api: 'content',
    collaborations: function collaborations(id, options, callback) {
      api.execute[this.api]('GET', this.url + '/' + id + '/collaborations', {}, options, callback);
    },
    items: function items(id, options, callback) {
      api.execute[this.api]('GET', this.url + '/' + id + '/items', {}, options, callback);
    }
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

module.exports = folder;