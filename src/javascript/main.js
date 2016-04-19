var translations = [];
var loopNum = 0,
	maxLoops = 15;

var languages = ["af", "ga", "sq", "it", "ar", "ja", "az", "kn", "eu", "ko", "bn",
				"la", "be", "lv", "bg", "lt", "ca", "ms",
				"hr", "no", "cs", "fa", "da", "pl", "nl", "pt", "ro",
				"eo", "ru", "fr", "es", "gl",
				"ka", "sv", "de", "ta", "el", "te", "gu", "th", "ht", "tr",
				"iw", "uk", "hi", "ur", "hu", "vi", "is", "cy", "id", "yi"];

function translate(targetLanguage){
	var toTranslate = encodeURI(translations[translations.length - 1].translation);
	
	if(targetLanguage === undefined){
		targetLanguage = languages[Math.floor(Math.random() * languages.length)];
	}

	var url = encodeURIComponent("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + targetLanguage + "&dt=t&q=" + toTranslate);

	//this is a generic YQL statement, will get the contents of any page
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='") + url + "'&format=json";

	$.getJSON(yql, function(data){
		parseData(data, targetLanguage);
		updateLoadingbar();
	}).then(function(e){
		translateLoop();
	});
}

function parseData(data, targetLanguage){
	//the google translate page adds a bunch of empty commas. this finds duplicate commas and replaces them with a single comma
	var text = data.query.results.body.replace(/(\,)\1+/g, ",");
	var json = JSON.parse(text);

	var translation = json[0][0][0];

	var object = {
		"translation": translation,
		"language": targetLanguage
	}

	translations.push(object);
}

function translateLoop(){
	//iterate normally
	if(loopNum < maxLoops){	
		translate();
		loopNum++;
	//when done, translate back into english
	} else if(loopNum == maxLoops){
		translate("en");
		loopNum++;
	//output stuff
	} else if(loopNum > maxLoops){
		displayResults();

		return;
	}
}

function updateLoadingbar(){
	var steps = loopNum / (maxLoops + 1);
	var loadingBar = document.querySelector(".loading-bar");
	var loadingBarText = document.querySelector(".loading-bar-text");

	loadingBarText.innerHTML = "Loading...";
	loadingBar.style.width = steps * 100 + "%";
}

function displayResults(){
	var loadingBarText = document.querySelector(".loading-bar-text");
	loadingBarText.innerHTML = "";

	var resultsDiv = document.querySelector(".results");
	var last = translations.length - 1;

	var html = 		"<div class='first'>" + 
						translations[0].translation + " - " + translations[0].language + 
					"<div>" +
					"<div class='last'>" +
						translations[last].translation + " - " + translations[last].language + 
					"</div>";

	resultsDiv.innerHTML = html;
}

document.querySelector("form").addEventListener("submit", function(event){
	event.preventDefault();
	var input = event.target[0].value;

	if(typeof input === "string" && input !== ""){
		loopNum = 0;
		//translate() translates the last variable in the array, so just set it to the new input
		translations = [
			{
				"translation": input,
				"language": "en"
			}
		];

		translate();
	}
});