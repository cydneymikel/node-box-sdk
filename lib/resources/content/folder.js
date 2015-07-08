var api       = require('../../api');
var generate  = require('../generate');

function folder(config) {
  var path = '/folders';
  var operations = ['create', 'get', 'update', 'delete'];

  var setup = {
    url: config.content.base + path,
    api: 'content',
    collaborations: function collaborations(id, options, callback) {
      api.execute[this.api]('GET', this.url + '/' + id + '/collaborations', {}, options, callback);
    },
    copy: function items(id, data, options, callback) {
      api.execute[this.api]('POST', this.url + '/' + id + '/copy', data, options, callback);
    },
    items: function items(id, options, callback) {
      api.execute[this.api]('GET', this.url + '/' + id + '/items', {}, options, callback);
    },
    restore: function restore(id, options, callback) {
      api.execute[this.api]('POST', this.url + '/' + id, {}, options, callback);
    },
    share: function share(id, data, options, callback) {
      api.execute[this.api]('PUT', this.url + '/' + id, data, options, callback);
    },
    trash: function trash(id, options, callback) {
      var location = id ? this.url + '/' + id + '/trash' : this.url + '/trash/items'
      api.execute[this.api]('GET', location, {}, options, callback);
    },
    destroy: function destroy(id, options, callback) {
      api.execute[this.api]('DELETE', this.url + '/' + id + '/trash', {}, options, callback);
    }
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

module.exports = folder;