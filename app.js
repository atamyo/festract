var express = require('express');
var path = require('path');

var app = express();
const PORT = 8888;

app.set('port', PORT);

app.use(express.static(path.join(__dirname + '/public')));
/*
app.get('/', function(req, res) {
//	res.sendFile(path.resolve('public/index.html'));
});
*/
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log("Listening on port " + port);

});