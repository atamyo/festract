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
		artist = artist.toLowerCase().trim();

		var options = {
			url: 'https://api.spotify.com/v1/search?' + querystring.stringify({
				q: 'artist:"' + artist + '"',
				type: 'track',
				//limit: '5',
				market: 'from_token'
			}),
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			json: true
		};

		request.get(options, function(error, response, body) {
			if (error) return callback(error);

			var topTrack = body;

			if (response.statusCode === 429) {

				var waitTime = response.headers['retry-after'] * 1000 + 1000;
				setTimeout(function() {
					request.get(options, function(error, response, body) {
						if (error) return callback(error);

						topTrack = body;

						if (typeof topTrack.tracks === "undefined") {
							return callback("Some kinda getTopTrack error");
						}

						if (topTrack.tracks.items.length === 0) {
							return callback("Couldn't find track for artist '" + artist + "'");
						}

					// Check if found artist is correct
					let attempt = 0;
					while (typeof topTrack.tracks.items[attempt] !== "undefined" && topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist && attempt < 5) {
				//		console.log('Desired artist: ' + artist + ', Found artist: ' + topTrack.tracks.items[attempt].artists[0].name);
						attempt++;
					}

					if (typeof topTrack.tracks.items[attempt] === "undefined" || topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist || attempt >= 5) {
						return callback("Couldn't find track for artist '" + artist + "'");
					}

				//	console.log('Found track ' + topTrack.tracks.items[attempt].name + ' for artist ' + artist);
					callback(null, topTrack.tracks.items[attempt].uri);
						
					});
				}, waitTime);
			}
			else {
				if (typeof topTrack.tracks === "undefined") {
					return callback("Some kinda getTopTrack error");
				}

				if (topTrack.tracks.items.length === 0) {
					return callback("Couldn't find track for artist '" + artist + "'");
				}
				
				var numResults = topTrack.tracks.items.length;


				// TODO: search is too strict
				// Check if found artist is correct
				let attempt = 0;
				while (typeof topTrack.tracks.items[attempt] !== "undefined" && topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist && attempt < numResults) {
				//	console.log('Desired artist: ' + artist + ', Found artist: ' + topTrack.tracks.items[attempt].artists[0].name);
					attempt++;
				}

				if (typeof topTrack.tracks.items[attempt] === "undefined" || topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist || attempt >= numResults) {
					return callback("Couldn't find track for artist '" + artist + "'");
				}

				//console.log('Found track ' + topTrack.tracks.items[attempt].name + ' for artist ' + artist);
				callback(null, topTrack.tracks.items[attempt].uri);
			}
		});
	},

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

			var data = {statusCode: response.statusCode, retryAfter: 0};

			//console.log('addTracks statusCode = ' + response.statusCode);
			if (response.statusCode === 201) {
				data.retryAfter = -1;
			}

			else if (response.statusCode === 429) {
				data.retryAfter = response.headers['retry-after'];
				setTimeout(function() {
					request.post(options, function(error, response, body) {
						if (error) return callback(error);
					});
				}, data.retryAfter * 1000 + 1000);

			}
			callback(null, data);
		});

	}
};