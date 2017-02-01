// Get Spotify username of currently logged in user
function getUsername(accessToken) {
    console.log("finding user id...");

    return $.ajax({
        url: 'https://api.spotify.com/v1/me',
        method: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
}

// Create Spotify playlist
function createPlaylist(userID, name, accessToken) {
    console.log("tryna make a playlist...");

    return $.ajax({
        url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',
        method: 'POST',
        data: JSON.stringify({
            'name': name,
            'public': false
        }),
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    });
}

// Search for an artist on Spotify
function searchArtist(artist) {
    console.log("tryna search for artists...");

    return $.ajax({
        url: 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(artist) + '&type=artist',
        method: 'GET',
        dataType: 'json'
    });

}

// Get Spotify URI of artist's top track
function getTopTrack(artistID) {
    console.log("need to find top track for " + artistID);

    return $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
        method: 'GET',
        dataType: 'json',
    });
}

// Create JSON array of Spotify track URIs
function pushTracks(trackURI, tracks) {
    console.log("create json array");
    var tracks = {
        uris: []
    };

    tracks.uris.push()
}

// Add Spotify track to playlist
function addTracks(userID, playlistID, trackURIs, accessToken) {
    console.log("tryna add track as user " + userID + " in playlist " + playlistID + " with access token " + accessToken);

    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks',
        method: 'POST',
        dataType: 'json',
        data: trackURIs,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    });
}

// Add Spotify track to playlist
function addTrack(userID, playlistID, trackURI, accessToken) {
    console.log("tryna add track as user " + userID + " in playlist " + playlistID + " with access token " + accessToken);

    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks?uris=' + encodeURIComponent(trackURI),
        method: 'POST',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    });
}
