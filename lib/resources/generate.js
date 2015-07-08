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
  }
};

module.exports.mixin = mixin;