var chai = require('chai');
var expect = chai.expect;

describe('Box Documents Operations', function() {
  this.timeout(5000);

  var box = global.box;

  it('should upload/create document view API for conversion', function(done) {
    var data = { url: global.downloadURI }; 

    box.view.document.create(data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('type', 'document');
      expect(res.body).to.have.property('id');
      
      global.documentId = res.body.id; 
      setTimeout(function() { done(); }, 3000);
    });
  });

});