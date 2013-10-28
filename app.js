/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var productRoutes = require('./routes/product');
var user = require('./routes/user');
var about = require('./routes/about');
var map = require('./routes/map');
var contact = require('./routes/contact');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');

var app = express();

var config = require('./config');

var User = require('./models/user');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', productRoutes.home);
app.get('/properties', productRoutes.index);
app.get('/add', productRoutes.new);
app.post('/properties', productRoutes.create);
app.param('name', productRoutes.pass);
app.get('/properties/:name', productRoutes.show);
app.get('/properties/:name/edit', productRoutes.edit);
app.put('/properties/:name', productRoutes.update);
app.delete('/properties/:name', productRoutes.remove);
app.post('/search',productRoutes.search);
app.get('/map',productRoutes.getmap);

app.get('/', routes.index);
app.get('/about', about.index);
app.get('/contact',contact.index);
//app.get('/map',map.index);
app.get('/users', user.list);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Successfully mongodb is connected');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

