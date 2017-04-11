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

			var topTrack = body;

			if (response.statusCode === 429) {
				//TODO: add these tracks if found after addTracks is called

				var waitTime = response.headers['retry-after'] * 1000 + 1000;
				console.log('getTopTrack rate limit, hold on for ' + waitTime/1000 + ' secs');
				setTimeout(function() {
					request.get(options, function(error, response, body) {
						if (error) return callback(error);

						console.log("...and we're back");
						topTrack = body;

						if (typeof topTrack.tracks === "undefined") {
							return callback("Some kinda getTopTrack error");
						}

						if (topTrack.tracks.items.length === 0) {
							return callback("Couldn't find track for artist '" + artist + "'");
						}

						console.log('Found track ' + topTrack.tracks.items[0].name + ' for artist ' + artist);
						callback(null, topTrack.tracks.items[0].uri);
						
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

				console.log('Found track ' + topTrack.tracks.items[0].name + ' for artist ' + artist);
				callback(null, topTrack.tracks.items[0].uri);
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

			console.log('addTracks statusCode = ' + response.statusCode);
			//console.log(response.headers);
			if (response.statusCode === 201) {
				data.retryAfter = -1;
			}

			else if (response.statusCode === 429) {
				// TODO: wait until rate limit is over, then try adding tracks again
				console.log('Need to wait ' + response.headers['retry-after'] + ' seconds');
				data.retryAfter = response.headers['retry-after'];
				setTimeout(function() {
					request.post(options, function(error, response, body) {
						if (error) return callback(error);
						console.log('lmao');
					});
				}, data.retryAfter * 1000 + 1000);

			}
			callback(null, data);
		});

	}
};