var config = require('../test/config');
var casper = require('casper').create({
    verbose: true,
    logLevel: 'error',
    pageSettings: config.headlessClient
});
casper.options.waitTimeout = 10000;

casper.start(casper.cli.args[0], function () {
  this.fillSelectors('form[name="login_form"]', {
    'input[name="login"]': casper.cli.args[1],
    'input[name="password"]': casper.cli.args[2],
  }, true);
});

casper.then(function () {
  this.waitForSelector('form[name="consent_form"]', function () {
    this.fillSelectors('form[name="consent_form"]', {}, true);
  });
});

casper.then(function (resource) {
  require('utils').dump(resource);
});

casper.run(function () {
  this.exit();
});
