var chai = require('chai');
var expect = chai.expect;

describe('Shared File Operations', function() {
  var box = global.box;

  it('should get a file or folder using shared link', function(done) {
    box.content.shared.get(global.shared_link, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('type');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('shared_link');

      global.options = { tokens: tokens };
      done();
    });
  });

});