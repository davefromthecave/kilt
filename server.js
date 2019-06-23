var kiltRoutes = require( './api/routes/kiltRoutes');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

kiltRoutes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);