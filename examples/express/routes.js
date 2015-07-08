module.exports = function(app) {

  app.get('/', function (req, res) {
    var box = req.app.box;
    var state = req.query.state || ''
    box.authorize(state, function(err, response) {
      res.redirect(response.redirect);
    });
  });

  app.get('/authorize/callback', function (req, res) {
    var box = req.app.box;
    box.generateToken({authorization_code: req.query.code}, function(err, tokens) {
      res.cookie('x-boxtoken', tokens).redirect('/folder/0');
    });
  });

  app.get('/folder/:id', function (req, res) {
    var box = req.app.box;
    var options = { tokens: req.cookies['x-boxtoken'] };
    box.content.folder.get(req.params.id, options, function(err, response, tokens) {
      res.cookie('x-boxtoken', tokens).json(response.body);
    });
  });

};