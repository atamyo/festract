var express = require('express');
var path = require('path');

var app = express();
const PORT = 1000;

app.set('port', PORT);

app.use(express.static(path.join(__dirname + 'public'));

app.get('/', function(req, res) {
//	res.sendFile(path.resolve('public/index.html'));
});