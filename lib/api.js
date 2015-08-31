var _          = require('lodash');
var config     = require('./config');
var superagent = require('superagent');
var utils      = require('./utils');


/**
 * Set up configuration globally such as client_id and client_secret,
 * by merging user configurations.  Configures encoding of tokens.
 * @param  {Object} options   Configuration parameters passed as object
 * @return {undefined}
 */
exports.configure = function configure(options) {
  config = _.merge(config, options);
  if (options.encrypt) {
    utils.configure(config.encrypt);
  }
};


/**
 * Returns redirect url
 * @return {Object}   Redirect url
 */
exports.authorize = function authorize(app, callback) {  
  if (!config.client_id) {
    return callback(new Error('Must provide client_id'));
  }
  var url = { redirect: config.oauth + '/authorize' + '?response_type=code' + '&client_id=' + config.client_id + '&state=' + app};
  callback(null, url);
};

/**
 * Generate access token by making a POST request to /oauth2/token by
 * exchanging client id/secret pair or valid token and refresh token.
 * @param  {Object}   options   parameters such as authorization code or refresh token
 * @param  {Function} callback  Callback function
 * @return {Object}             Response from BOX API with Encoded Access token and Refresh token
 */
var generateToken = exports.generateToken = function generateToken(options, callback) {

  var payload = {
    client_id: 'client_id=' + config.client_id,
    client_secret: 'client_secret=' + config.client_secret
  };

  if (options.authorization_code) {
    payload.grant_type = 'grant_type=authorization_code';
    payload.code = 'code=' + options.authorization_code;
  } else if (options._tokens && options._tokens.refresh_token) {
    payload.grant_type = 'grant_type=refresh_token';
    payload.code = 'refresh_token=' + options._tokens.refresh_token;
  } else {
    var err = new Error('Must provide authorization_code or refresh_token');
    return callback(err);
  }

  superagent
    .post(config.oauth + '/token')
    .type('application/x-www-form-urlencoded')
    .send(payload.grant_type)
    .send(payload.code)
    .send(payload.client_id)
    .send(payload.client_secret)
    .end(function(err, res) {
      if (!err) {
        options._tokens = res.body;
        options.tokens = config.encrypt ? utils.encrypt(res.body) : res.body;

        if (options.headers)
          options.headers.Authorization = 'Bearer ' + options._tokens.access_token;
      }
      callback(err, options.tokens);
    });
};

/* Update authorization header with new token obtained by calling generateToken
 * Updates http Authorization header to newly created access token
 * Updates encrypted_tokes to newly created access token and refresh tokens
 * @param  {Object}    options   Configuration parameters such as refresh token
 * @param  {Function}  callback
*/
function _updateToken(options, error_callback, next) {
  generateToken(options, function(err, res) {
    if (err) {
      error_callback(err);
    } else {
      next();
    }
  });
}


/* Execute calls for with the Content API or View API
 * @param  {String}    method   CRUD methods
 * @param  {String}    path     box api endpoint
 * @param  {Object}    data     data for POST or PUT
 * @param  {Object}    options  required (encrypted_tokens)
 * @param  {Function}  callback 
 * @return {Function}  Box Content and View methods
*/
exports.execute = (function execute() {

  function view(method, path, data, options, callback) {
    _view(method, path, data, options, callback);
  }

  function content(method, path, data, options, callback) {
    _content(method, path, data, options, callback);
  }

  return {
    view: view,
    content: content
  };

})();


function _view(method, path, data, options, callback) {
  if (options) {
    options = _.merge(options, config);
  }

  options.headers.Authorization = 'Token ' + options.api_key;

  _invoke(method, path, data, options, function(error, response) {
    callback(error, response);
  });
}

function _content(method, path, data, options, callback) {
  if (options) {
    options = _.merge(options, config);
  }

  function _retryInvoke() {
    _invoke(method, path, data, options, callback);
  }

  if (options.tokens) {
    options._tokens = config.encrypt ? utils.decrypt(options.tokens) : options.tokens;
    options.headers.Authorization = 'Bearer ' + options._tokens.access_token;

    _invoke(method, path, data, options, function(error, response, tokens) {
      if (error && error.response.status === 401) {
        options.headers.Authorization = null;
        _updateToken(options, callback, _retryInvoke);
      } 
      else {
        callback(error, response, tokens);
      }
    });
  } 
  else {
    _updateToken(options, callback, _retryInvoke);
  }
}

function _invoke(method, path, data, options, callback) {

  var request = superagent(method, path);

  _.each(options.headers, function(val, key) {
    request = request.set(key, val);
  });

  if (options.params) request = request.query(options.params);

  switch(method) {
    case 'GET':
    case 'DELETE':
      request
        .end(function(err, res) {
          callback(err, res, options.tokens);
        });
      
      break;  
    
    case 'POST': 
    case 'PUT':
      if (options.multipart) {
        _.each(data.fields, function(val, key) {
          request = request.field(key, JSON.stringify(val));
        });

        if (data.files) {
          _.each(data.files, function(file) {
            request = request.attach('file', file.file, file.filename);
          });
        }

      } else {
        request = request.send(data);
      }

      request
        .end(function(err, res) {
          callback(err, res, options.tokens);
        });
      
      break;
  }
}