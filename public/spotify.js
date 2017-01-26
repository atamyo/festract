// Get Spotify username of currently logged in user
function getUsername(accessToken, callback) {
    console.log("finding user id...");
    var url = "https://api.spotify.com/v1/me";

    $.ajax(url, {
        method: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: function(r) {
            console.log("got username: " + r.id);
            callback(r.id);
        }
    });
}

// Create Spotify playlist
function createPlaylist(userID, name, accessToken, callback) {
    console.log("tryna make a playlist...");
    var url = "https://api.spotify.com/v1/users/" + userID + "/playlists";

    $.ajax(url, {
        method: 'POST',
        data: JSON.stringify({
            'name': name,
            'public': false
        }),
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        success: function(r) {
            console.log("created playlist");
            callback(r.id);
        },
        error: function(r) {
            console.log("createPlaylist oh noez");
            callback(null);
        }
    });
}

// Search for artists on Spotify
function searchArtists(artists, callback) {
    var artist = "";

    for (var i = 0; i < artists.length; i++) {
        artist = artists[i];
        var url = "https://api.spotify.com/v1/search?q=" + artist + "&type=artist";

        $.ajax(url, {
            method: 'GET',
            dataType: 'json',
            success: function(r) {
                console.log("searched for " + artist + " at " + url);
                callback(r.artists.items[0].id);
            }
        });
    }
}

// Get Spotify URI of artist's top track
function getTopTrack(artistID, callback) {
    console.log("need to find top track for " + artistID);

    var url = "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US";

    $.ajax(url, {
        method: 'GET',
        dataType: 'json',
        success: function(r) {
            callback(r.tracks[0].uri);
        }
    });
}

// Create JSON array of Spotify track URIs
function createTrackList() {
    console.log("soon...........");
}

// Add Spotify track to playlist
function addTrack(userID, playlistID, trackURI, accessToken, callback) {
    // TODO pass json array of tracks in request body
    console.log("tryna add track " + trackURI + " as user " + userID + " in playlist " + playlistID + " with access token " + accessToken);

    var url = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks?uris=" + encodeURIComponent(trackURI);

    $.ajax(url, {
        method: 'POST',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            console.log("ayy added the track");
            callback(r.id);
        },
        error: function(r) {
            console.log("addTrack oh noez");
            callback(null);
        }
    });
}