var api = require('../api');

/**
 * Attach REST operations from restFunctions as required by a Box API
 * resource e.g. items, collaborations and copy are attahed for Folder resource
 * @param  {Object} destObject A Box resource e.g. Folder
 * @param  {Array}  operations that the destObject will allow e.g. create
 * @return {Object}
 */
function mixin(destObject, operations) {
  operations.forEach(function(property) {
    destObject[property] = restFunctions[property];
  });
  return destObject;
}

/**
 * restFunctions Object containing the REST CRUD methods that
 * are shared between at least two of the REST endpoints, otherwise the function
 * will be defined within the resource definition itself
 * @type {Object}
 */
var restFunctions = {
  // CRUD
  create: function create(data, options, cb) {
    api.execute[this.api]('POST', this.url, data, options, cb);
  },
  get: function get(id, options, cb) {
    id = (id) ? '/' + id : '';
    api.execute[this.api]('GET', this.url + id, {}, options, cb);
  },
  update: function update(id, data, options, cb) {
    api.execute[this.api]('PUT', this.url + '/' + id, data, options, cb);
  },
  delete: function update(id, options, cb) {
    api.execute[this.api]('DELETE', this.url + '/' + id, {}, options, cb);
  },
  // SHARED
  copy: function copy(id, data, options, callback) {
    api.execute[this.api]('POST', this.url + '/' + id + '/copy', data, options, callback);
  },
  destroy: function destroy(id, options, callback) {
    api.execute[this.api]('DELETE', this.url + '/' + id + '/trash', {}, options, callback);
  },
  restore: function restore(id, data, options, callback) {
    api.execute[this.api]('POST', this.url + '/' + id, data, options, callback);
  },
  share: function share(id, data, options, callback) {
    api.execute[this.api]('PUT', this.url + '/' + id, data, options, callback);
  },
  trash: function trash(id, options, callback) {
    var location = id ? this.url + '/' + id + '/trash' : this.url + '/trash/items'
    api.execute[this.api]('GET', location, {}, options, callback);
  }
};

module.exports.mixin = mixin;