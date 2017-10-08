var express = require("express");
var logger = require('morgan');
var Request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the lib folder for css & js files
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.get("/", function(req, res){
  res.render('game');
});

var port = process.env.PORT || 3000;
var server = app.listen(port);
console.log('App is running on ' + port)
