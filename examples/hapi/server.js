var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 8888 });

server.register({ register: require('./plugins/box') }, function(err) {
  if (err) { console.error('Failed to load plugin:', err); }
});

var routes = require('./routes');
server.route(routes);

server.start(function () {
  console.log('server is listening');
});