var config    = require('../../config');

exports.file = require('./file')(config);
exports.folder = require('./folder')(config);
exports.shared = require('./shared')(config);
