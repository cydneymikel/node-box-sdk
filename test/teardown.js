var chai = require('chai');
var expect = chai.expect;

describe('Box Teardown', function() {
  this.timeout(20000);
  
  var box = global.box;

  it('should delete a file from box folder', function(done) {
    box.content.file.delete(global.fileId, global.options, function(err, res) {
      expect(res.statusCode).to.equal(204);
      done();
    });
  });

  it('should delete folder from box', function(done) {
    box.content.folder.delete(global.folderId, global.options, function(err, res) {
      expect(res.statusCode).to.equal(204);
      done();
    });
  });


});