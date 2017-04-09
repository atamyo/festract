function Tracklist(capacity) {
	this.capacity = capacity;
	this.numSublists = 1;
	this[generateKey(1, capacity)] = [];
}

/*
Tracklist.prototype.createSublist = function() {
	this.numSublists++;
	this[generateKey(this.numSublists, this.capacity)] = [];
};
*/

Tracklist.prototype.addTrack = function(trackURI) {
	var currentKey = generateKey(this.numSublists, this.capacity);

	if (this[currentKey].length >= this.capacity) {
	//if (isFull(this[currentKey].length, this.capacity)) {
		this.numSublists++;
		currentKey = generateKey(this.numSublists, this.capacity);
		this[currentKey] = [];
	}

	this[currentKey].push(trackURI);
	//this[generateKey(this.numSublists, this.capacity)].push(trackURI);
};

Tracklist.prototype.getKey = function(index) {
	return generateKey(index, this.capacity);
}

/*
function isFull(length, max) {
	return max > length;
}
*/

function generateKey(num, max) {
	var start = (num - 1) * max;
	var end = num * max; 

	return 'tracks' + start + '-' + end;
}

module.exports = Tracklist;