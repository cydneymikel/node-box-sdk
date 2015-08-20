var async   = require('async');
var chai    = require('chai');
var expect  = chai.expect;
var fs      = require('fs');
var path    = require('path');

describe('Box File Operations', function() {
  this.timeout(5000);
  
  var box = global.box;

  // POST Upload File
  it('should upload a file to box folder', function(done) {

    var mock = path.join(__dirname, '../..', '/mocks/fact_sheet.pdf');
    var file = fs.createReadStream(mock);
    var data = { name: 'Penguin Facts', folder: global.folderId, file: file, filename: 'penguin_fact_sheet.pdf' };
    
    box.content.file.upload(data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('entries');
      expect(res.body.entries[0]).to.have.property('id');
      expect(res.body.entries[0]).to.have.property('type', 'file');
      expect(res.body.entries[0]).to.have.property('name');

      global.fileId = res.body.entries[0].id;
      global.options = { tokens: tokens };
      done();
    });
  });

  // GET File Info
  it('should get info for a file from box folder', function(done) {
    box.content.file.get(global.fileId, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.fileId);
      expect(res.body).to.have.property('type', 'file');

      global.options = { tokens: tokens };
      done();
    });
  });

  // PUT Create Shared Link
  it('should create a shared link for a file', function(done) {
    var data = { shared_link: { } };

    box.content.file.share(global.fileId, data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.fileId);
      expect(res.body).to.have.property('type', 'file');
      expect(res.body).to.have.property('shared_link');
      expect(res.body.shared_link).to.have.property('url');

      global.shared_link = res.body.shared_link.url;
      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Download File
  it('should download link for a file from box folder', function(done) {
    box.content.file.download(global.fileId, global.options, function(err, res, tokens) {
      expect(res).to.have.property('redirects');
      expect(res.redirects[0]).to.contain('https://dl.boxcloud.com/');

      global.downloadURI = res.redirects[0];
      global.options = { tokens: tokens };
      done();
    });
  });

  // POST Copy File
  var copiedFile;
  it('should create a copy of a file in another folder.', function(done) {
    var data = { parent: { id: 0 } };
    box.content.file.copy(global.fileId, data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('type', 'file');
      expect(res.body).to.have.property('name');

      copiedFile = res.body;
      global.options = { tokens: tokens };
      done();
    });
  });

  // DELETE File
  it('should delete folder from box', function(done) {
    box.content.file.delete(copiedFile.id, global.options, function(err, res, tokens) {
      expect(res.statusCode).to.equal(204);

      global.options = { tokens: tokens };
      done();
    });
  });

  // POST Restore File
  it('should restore a file from trash', function(done) {
    box.content.file.restore(copiedFile.id, {}, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('type', 'file');
      expect(res.body).to.have.property('name');

      global.options = { tokens: tokens };
      done();
    });
  });

  // DELETE Trash and then Permanently Delete File
  it('should permanently delete a file', function(done) {
    async.series({
      remove: function(next) {
        box.content.file.delete(copiedFile.id, global.options, function(err, res, tokens) {
          global.options = { tokens: tokens };
          next(err, res);
        });
      },
      destroy: function(next) {
        box.content.file.destroy(copiedFile.id, global.options, function(err, res, tokens) {
          global.options = { tokens: tokens };
          next(err, res);
        });
      }
    }, function(err, result) {
      expect(result.remove.statusCode).to.equal(204);
      expect(result.destroy.statusCode).to.equal(204);

      done();
    });
  });

});