var box = require('../../../../box');

module.exports = function() {
  return function nodeBoxSDK(req, res, next) {
    box.configure({
      client_id: '',
      client_secret: '',
      api_key: '',
      encrypt: { password: 'node-box' }
    });
    req.app.box = box;

    next();
  };
};