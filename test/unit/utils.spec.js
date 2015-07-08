var utils = require('../../lib/utils');

var chai = require('chai');
var expect = chai.expect;

describe('Box Utils', function () {

  utils.configure({algorithm: 'aes-256-ctr', password: 'caabox'});
  
  var tokens = {
    access_token: 'HkD0CuFtClcHYqRScImvU4ys1cldC8rs',
    refresh_token: 'ozBFNWAn6PZ1ReGO1Lkmh2WC0pNIstZNf4Ji5Z3sqIKR7fnabDBI84mHn3oXGhIf',
  };

  var encrypted;

  it('should encrypt', function (done) {
    encrypted = utils.encrypt(tokens);
    expect(encrypted).to.be.a('string');
    done();
  });

  it('should decrypt', function (done) {
    var decrypted = utils.decrypt(encrypted);
    expect(decrypted).to.have.property('access_token', tokens.access_token);
    expect(decrypted).to.have.property('refresh_token', tokens.refresh_token);
    done();
  });

});