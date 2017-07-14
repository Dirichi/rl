require('dotenv').config();
var express = require("express");
var logger = require('morgan');
var Request = require('request');
var bodyParser = require('body-parser');
var nano = require('nano')(process.env.DB_HOST);
var db = nano.use(process.env.DB);

db.update = function (obj, key, callback) {
  db.get(key, function (error, existing) {
    if(!error) obj._rev = existing._rev;
    db.insert(obj, key, callback);
  })
};


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
var io = require('socket.io')(server);
console.log('App is running on ' + port)

io.on('connection', function (socket) {
  socket.emit('ready', { ready: true });
  socket.on('insert', function (data) {
    db.update(data, data.id, function (err, body, header) {
      if (err){
        console.log(err);
      };
    });
  })
})
