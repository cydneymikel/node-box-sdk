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
      console.log(res)
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

});