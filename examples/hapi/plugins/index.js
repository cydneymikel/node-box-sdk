var box = require('../../../box');

exports.register = function (server, config, next) {

  // ADD YOUR CONFIGURATIONS HERE
  box.configure({
    client_id: '',
    client_secret: '',
    api_key: '',
    encrypt: { "password": "node-box" }
  });

  server.state('x-boxtoken', {isHttpOnly: true, encoding: 'none', path: '/'});
  server.expose('client', box);

  next();
};

exports.register.attributes = {
  name:    'node-box-sdk-plugin',
  version: '1.0.0'
};