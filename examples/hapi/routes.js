var routes = [];

// Authentication URL
routes.push({
  method:  'GET',
  path:    '/',
  handler: function (req, reply) {
    var box = req.server.plugins.box;
    var state = req.query.state || ''
    box.client.authorize(state, function(err, res) {
      reply.redirect(res.redirect);
    });
  }
});

// Handle callback from Box 
routes.push({
  method:  'GET',
  path:    '/authorize/callback',
  handler: function (req, reply) {
    console.log(req.server.plugins)
    var box = req.server.plugins.box;
    box.client.generateToken({authorization_code: req.query.code}, function(err, tokens) {
      reply.redirect('/file/0').state('x-boxtoken', tokens);
    });
  }
});

// Get File Info
routes.push({
  method:  'GET',
  path:    '/folder/{id}',
  handler: function (req, reply) {
    var box = req.server.plugins.box;
    var options = { tokens: req.state['x-boxtoken'] };
    box.client.content.folder.get(req.params.id, options, function(err, res, tokens) {
      reply(res.body).state('x-boxtoken', tokens);
    });
  }
});

module.exports = routes;