var request = require('request');
var querystring = require('querystring');

// Gets userID and access and refresh tokens of currently logged in user
/*
function setUserInfo(request) {
	return {
		userID: request.userID,
		accessToken: request.accessToken,
		refreshToken: request.refreshToken
	};
}
*/

/*
Can actually do this before steps below:
Preview tracks
1. Find songs without access token (unless already logged in...then use token)
2. Sort songs
3. Display sorted songs as a playlist preview
*/

/*
Save sorted songs as playlist
1. Authorize user
2. If successful, will have access and refresh tokens
3. Get username from access token
4. 
*/
/*
// Finds one song from each artist
exports.findSongs = function(req, res, next) {

	let userInfo = setUserInfo(req.user);


};

// Sorts songs by similarity for smoother transitions
exports.sortSongs = function(req, res, next) {

};

// Creates new Spotify playlist with sorted songs
exports.generatePlaylist = function(req, res, next) {

};
*/

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
				//TODO: add these tracks if found after addTracks is called

				var waitTime = response.headers['retry-after'] * 1000 + 1000;
				//console.log('getTopTrack rate limit, hold on for ' + waitTime/1000 + ' secs');
				setTimeout(function() {
					request.get(options, function(error, response, body) {
						if (error) return callback(error);

						//console.log("...and we're back");
						topTrack = body;

						if (typeof topTrack.tracks === "undefined") {
							return callback("Some kinda getTopTrack error");
						}

						if (topTrack.tracks.items.length === 0) {
							return callback("Couldn't find track for artist '" + artist + "'");
						}

						//console.log('Track info: ' + topTrack.tracks);

					// Check if found artist is correct
					let attempt = 0;
					while (typeof topTrack.tracks.items[attempt] !== "undefined" && topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist && attempt < 5) {
						console.log('Desired artist: ' + artist + ', Found artist: ' + topTrack.tracks.items[attempt].artists[0].name);
						attempt++;
					}

					if (typeof topTrack.tracks.items[attempt] === "undefined" || topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist || attempt >= 5) {
						return callback("Couldn't find track for artist '" + artist + "'");
					}

					console.log('Found track ' + topTrack.tracks.items[attempt].name + ' for artist ' + artist);
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
				/*
				console.log('Found track ' + topTrack.tracks.items[0].name + ' for artist ' + artist);
				callback(null, topTrack.tracks.items[0].uri);
				*/
				
				var numResults = topTrack.tracks.items.length;


				// TODO: search is too strict, fix later 
				// Check if found artist is correct
				let attempt = 0;
				while (typeof topTrack.tracks.items[attempt] !== "undefined" && topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist && attempt < numResults) {
					console.log('Desired artist: ' + artist + ', Found artist: ' + topTrack.tracks.items[attempt].artists[0].name);
					attempt++;
				}

				if (typeof topTrack.tracks.items[attempt] === "undefined" || topTrack.tracks.items[attempt].artists[0].name.toLowerCase() !== artist || attempt >= numResults) {
					return callback("Couldn't find track for artist '" + artist + "'");
				}

				console.log('Found track ' + topTrack.tracks.items[attempt].name + ' for artist ' + artist);
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

			console.log('addTracks statusCode = ' + response.statusCode);
			//console.log(response.headers);
			if (response.statusCode === 201) {
				data.retryAfter = -1;
			}

			else if (response.statusCode === 429) {
				// TODO: wait until rate limit is over, then try adding tracks again
				//console.log('Need to wait ' + response.headers['retry-after'] + ' seconds');
				data.retryAfter = response.headers['retry-after'];
				setTimeout(function() {
					request.post(options, function(error, response, body) {
						if (error) return callback(error);
						//console.log('lmao');
					});
				}, data.retryAfter * 1000 + 1000);

			}
			callback(null, data);
		});

	}
};