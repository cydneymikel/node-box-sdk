var box     = require('../box');
var chai    = require('chai');
var config  = require('./config');
var expect  = chai.expect;
var fs      = require('fs');
var url     = require('url');
var util    = require('../test_helpers/util');

describe('Box Intialize', function() {
  this.timeout(20000);
  
  var redirect;
  box.configure(config.box);
  global.box = box;

  describe('Box Auth URL', function() {
    it('should return url for authentication', function(done) {
      var state = 'string_value';

      box.authorize(state, function(err, res) {
        expect(res).to.have.property('redirect');
        redirect = res.redirect;

        var parsed = url.parse(res.redirect, true);
        expect(parsed).to.have.property('host', 'app.box.com');

        expect(parsed).to.have.property('query');
        expect(parsed.query).to.have.property('response_type', 'code');
        expect(parsed.query).to.have.property('client_id');
        expect(parsed.query).to.have.property('state', state);

        done();
      });
    });
  });

  describe('Box Tokens', function() {
    var code = '';
    before(function(done) {
      var args = [redirect, config.username, config.password];

      util.runHeadlessClient(args, function(resource) {
        code = url.parse(resource.url, true).query.code;
        done();
      });
    });

    it('should generate tokens for user', function(done) {
      box.generateToken({ authorization_code: code }, function(err, tokens) {
        if (config.box.encrypt)
          expect(tokens).to.be.a('string');
        else 
          expect(tokens).to.be.an('object');

        global.options = { tokens: tokens };
        done();
      });
    });
  });

});