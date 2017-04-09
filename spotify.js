var request = require('request');
var querystring = require('querystring');

module.exports = {
	getUsername: function(accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/me',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			json: true
		};
		
		request.get(options, function(error, response, body) {
			if (error) return callback(error);

			callback(null, body.id);
		});
	},

	createPlaylist: function(name, userID, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',
        	form: JSON.stringify({
            	'name': name,
            	'public': false
        	}),
        	headers: {
            	'Authorization': 'Bearer ' + accessToken,
            	'Content-Type': 'application/json'
        	},
        	json: true
		};

		request.post(options, function(error, response, body) {
			if (error) return callback(error);

			callback(null, body.id);
		});
	},

	getTopTrack: function(artist, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/search?' + querystring.stringify({
				q: "artist:" + artist,
				type: 'track',
				limit: '1',
				market: 'from_token'
			}),
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			json: true
		};

		request.get(options, function(error, response, body) {
			if (error) return callback(error);

			else if (typeof body.tracks === "undefined") {
				return callback("Some kinda getTopTrack error");
			}

			else if (body.tracks.items.length === 0) {
				return callback("Couldn't find track for artist '" + artist + "'");
			}

			console.log('Found track ' + body.tracks.items[0].name + ' for artist ' + artist);
			callback(null, body.tracks.items[0].uri);
		});
	},
/*
	addTrack: function(trackURI, userID, playlistID, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks',
			headers: {
				'Authorization': 'Bearer ' + accessToken,
				'Content-Type': 'application/json'
			},
			form: JSON.stringify({ uris: [trackURI] }),
			json: true
		};

		request.post(options, function(error, response, body) {
			if (error) return callback(error);

			callback(null, body);
		});
	},*/

	addTracks: function(trackURIs, userID, playlistID, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			form: JSON.stringify({ uris: trackURIs }),
			json: true
		};

		request.post(options, function(error, response, body) {
			if (error) return callback(error);

			console.log('addTracks statusCode = ' + response.statusCode);
			if (response.statusCode === 201) console.log('Added tracks!');
			callback(null, body);
		});

	}
};