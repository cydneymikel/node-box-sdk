var crypto = require('crypto');
var config = {};

exports.configure = function configure(options) {
  config = {
    algorithm: options.algorithm || 'aes-256-ctr',
    password: options.password
  };
};

exports.encrypt = function encrypt(text) {
  if (typeof text !== 'string' || (!text instanceof String)) {
    text = JSON.stringify(text);
  }
  var cipher = crypto.createCipher(config.algorithm, config.password);

  var encrypted = cipher.update(text,'utf8','hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
 
exports.decrypt = function decrypt(text) {
  var decipher = crypto.createDecipher(config.algorithm, config.password);

  var decrypted = decipher.update(text,'hex','utf8');
  decrypted += decipher.final('utf8');

  try {
    var parsed = JSON.parse(decrypted);
    return parsed;
  } catch (e) {
    return decrypted;
  }
};
 