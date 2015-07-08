var chai = require('chai');
var expect = chai.expect;

describe('Box Session Operations', function() {

  var box = global.box;

  it('should return view url for the document', function(done) {
    var data = { document_id: global.documentId }; 
    box.view.session.create(data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('type', 'session');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('urls');
      
      done();
    });
  });

});