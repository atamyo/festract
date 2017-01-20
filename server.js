// There are going to be lots of comments because I am Node.js noob rn

// Load the HTTP library
var http = require('http');

// Define which port we want to listen to
const port = 8080;

// Handle requests and send responses
function handleRequest(request, response) {
	response.end("woooo");
}

// Create an HTTP server to handle requests and send responses
var server = http.createServer(handleRequest);

// Start server
server.listen(port, function() {
	// Callback triggered when server is listening
	console.log("Server listening on: http://localhost:%s", port);
});
