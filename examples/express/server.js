var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var boxNodeSDK   = require('./middleware/box');

app.use(boxNodeSDK());
app.use(cookieParser())

require('./routes')(app);

app.listen(8888, function() {
  console.log('server is listening');
});