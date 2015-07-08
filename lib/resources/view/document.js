var api       = require('../../api');
var generate  = require('../generate');

function document(config) {
  var path = '/documents';
  var operations = ['create'];

  var setup = {
    url: config.view.base + path,
    api: 'view',
    upload: function upload(data, options, callback) {
      options.multipart = true;
      var form = _buildUploadForm(data);
      api.execute[this.api]('POST', config.view.upload + path, form, options, callback);
    }
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

function _buildUploadForm(data) {
  return {
    files: [{ filename: data.filename, file: data.file  }]
  };
}

module.exports = document;