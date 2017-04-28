var TesseractJS = require('tesseract.js');

exports.generateResultList = function(url) {
	return runOCR(url);
};

function runOCR(url) {
	TesseractJS.recognize(url)
    	.progress(function(progress) {
    		console.log(progress["status"] + " (" + (progress["progress"] * 100) + "%)");
    	}).then(function(result) {
            console.log(result.text);
            return splitResults(spellCheck(result.text));
        }).catch(function(error) {
        	console.error(error);
        	return "Error";
        });
}


function getSeparator(results) {

}


function spellCheck(resultsList) {
	var text = resultsList;

	// Left parenthesis '(' to 'C'
	text = text.replace(/\(/g, "C");
	
	// Zero '0' to 'O'
	text = text.replace(/0/g, "O");

	// 'ihe' to 'the'
	text = text.replace(/ihe/gi, "the");

	// \n to ' - '
	text = text.replace(/\n/g, " - ");

	return text.toLowerCase();
}

function splitResults(results, separator) {
	// TODO: Add \n newline separator
	var re = separator === null ? /\s\W\s|\s\d\s/ : /\s\W\s|\s\d\s/;
	//var separator = /\s\W\s|\s\d\s/;
	var artists = results.split(re);

	//console.log("artist list: " + artists);
	return artists;

}