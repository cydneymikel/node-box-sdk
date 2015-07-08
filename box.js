var api = require('./lib/api');

module.exports = (function() {

  function configure(options) {
    api.configure(options);
  }

  function authorize(app, callback) {
    api.authorize(app, callback);
  }

  function generateToken(options, callback) {
    api.generateToken(options, callback);
  }

  return {
    authorize: authorize,
    configure: configure,
    generateToken: generateToken,
    content: require('./lib/resources/content'),
    view: require('./lib/resources/view')
  };
})();
