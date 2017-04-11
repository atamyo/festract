// Return text between specified strings

module.exports = function(str, start, end, callback) {
	
	var reStr = escapeRegExp(start)
				+ '(.+?)' 
				+ '(?=' + escapeRegExp(end) + ')';

	var re = new RegExp(reStr, 'gi');

	var tokens = str.match(re).map(function(matched) {
		return matched.replace(start, '');
	});

	callback(null, tokens);
}

function escapeRegExp(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}