var cp = require('child_process');
var path = require('path');

exports.runHeadlessClient = function (args, done) {
  var casperjs = path.resolve(__dirname,  '../node_modules/casperjs/bin/casperjs');

  args.unshift('--ssl-protocol=tlsv1');
  args.unshift('test_helpers/login.js');

  var ghost = cp.spawn(casperjs, args);

  var result;
  ghost.stdout.setEncoding('utf8');
  
  ghost.stdout.on('data', function (data) {
    try {
      result = JSON.parse(data);
    } catch(e) {
      //ignore
    }
  });

  ghost.on('exit', function (code) {
    done(result);
  });
};