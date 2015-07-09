var express = require('express');
var app     = express();
var routes  = require('./routes');
var port    = process.env.PORT || 3000;

app.use('/', routes);
app.use(function(err, req, res, next) {
  res.status(400).json({ error: err });
});

app.listen(port);
console.log('May the force be with you on port ' + port);

module.exports = app;