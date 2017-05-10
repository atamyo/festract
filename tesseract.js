var TesseractJS = require('tesseract.js');

function runOCR(url, callback) {
	TesseractJS.recognize(url)
    	.progress(function(progress) {
    		console.log(progress["status"] + " (" + (progress["progress"] * 100) + "%)");
    	}).then(function(result) {
            console.log(result.text);
            var resultList = splitResults(spellCheck(result.text));
            callback(null, resultList);
            //callback(null, splitResults(spellCheck(result.text)));
        }).catch(function(error) {
        	console.error(error);
        	return callback(error);
        	//return callback("OCR error");
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
	var re = separator === null ? /\s\W\s|\s\d\s/ : /\s\W\s|\s\d\s/;
	var artists = results.split(re);

	return artists;
}

exports.generateResultList = function(url, callback) {
	//console.log("wahaha" + runOCR(url));
	runOCR(url, function(err, data) {
		if (err) return console.error("Error: " + err);

		callback(null, data);
	});
};
