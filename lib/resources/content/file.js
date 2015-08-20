var _         = require('lodash');
var api       = require('../../api');
var async      = require('async');
var generate  = require('../generate');

function file(config) {
  var path = '/files';
  var operations = ['get', 'delete', 'copy', 'destroy', 'restore', 'share', 'trash'];

  var setup = {
    url: config.content.base + path,
    api: 'content',
    download: function download(id, options, callback) {
      api.execute[this.api]('GET', this.url + '/' + id + '/content', {}, options, callback);
    },
    upload: function upload(data, options, callback) {
      options.multipart = true;
      var form = _buildUploadForm(data);
      api.execute[this.api]('POST', config.content.upload + path + '/content', form, options, callback);
    }
    // TODO implement wrapper around creating view from content - ROUGH DRAFT
    // view: function view(id, options, callback) {
    //   var self = this;

    //   async.waterfall([
    //     function download(next) {
    //       self.download(id, options, next);
    //     },
    //     function createDoc(res, next) {
    //       var data = { url: res.redirect[0] };
    //       api.execute.view('POST', config.view + '/sessions', data, options, next);
    //     },
    //     function createSession(res, options, next) {
    //       var data = { document_id: res.body.id };
    //       api.execute.view('POST', config.view + '/session', data, options, next);
    //     }
    //   ], function done(err, result) {
    //     api.execute.view('GET', config.view + '/view/' + result.body.id, {}, options, callback);
    //   });
    // }
  };

  var mixin = generate.mixin(setup, operations);
  return mixin;
}

// TODO loop through files
function _buildUploadForm(data) {
  return {
    fields: {
      attributes: {
        name: data.name,
        parent: { id: data.folder }
      },
      another: {}
    },
    files: [{ filename: data.filename, file: data.file  }]
  };
}

module.exports = file;