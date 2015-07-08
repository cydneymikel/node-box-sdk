var config    = require('../../config');

exports.document = require('./document')(config);
exports.session = require('./session')(config);