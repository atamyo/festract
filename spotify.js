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

	searchArtists: function(artistIDs, callback) {
		artistIDs.forEach(function(artist) {
			var options = {
				url: 'https://api.spotify.com/v1/search?' + querystring.stringify({
					q: artist,
					type: 'artist'
				}),
				json: true
			};

			request.get(options, function(error, response, body) {
				if (error) return callback(error);
				else if (typeof body.artists.items[0] === "undefined") return callback("Couldn't find artist '" + artist + "'");

				callback(null, body.artists.items[0].id);
			});
		});
	},

	getTopTrack: function(artistID, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
			json: true
		};

		request.get(options, function(error, response, body) {
			if (error) return callback(error);
			else if (typeof body.tracks[0] === "undefined") return callback("Couldn't find track");

			callback(null, body.tracks[0].uri);
		});
	},

	addTrack: function(trackURI, userID, playlistID, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks?uris=' + trackURI,
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			json: true
		};

		request.post(options, function(error, response, body) {
			if (error) return callback(error);

			callback(null, body);
		});
	},

	addTracks: function(trackURIs, userID, playlistID, accessToken, callback) {
		var options = {
			url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			form: JSON.stringify(trackURIs),
			json: true
		};

		request.post(options, function(error, response, body) {
			if (error) return callback(error);

			callback(null, body);
		});

	}
};