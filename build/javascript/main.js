var translations = [];
var shouldTranslate = true; //variable to stop translating loop
var finished = false;
var loopNum = 0,
    maxLoops = 5;

var languages = ["af", "ga", "sq", "it", "ar", "ja", "az", "kn", "eu", "ko", "bn",
    "la", "be", "lv", "bg", "lt", "ca", "ms",
    "hr", "no", "cs", "fa", "da", "pl", "nl", "pt", "ro",
    "eo", "ru", "fr", "es", "gl",
    "ka", "sv", "de", "ta", "el", "te", "gu", "th", "ht", "tr",
    "iw", "uk", "hi", "ur", "hu", "vi", "is", "cy", "id", "yi"
];

function translate(targetLanguage) {
    var errorTimeout = setTimeout(alertError, 10000);
    var q = encodeURI(translations[translations.length - 1].translation);

    if (targetLanguage === undefined) {
        targetLanguage = languages[Math.floor(Math.random() * languages.length)];
    }

    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + targetLanguage + "&dt=t&q=" + q;
    var full = 'https://allorigins.me/get?url=' + encodeURIComponent(url) + "&callback=?";


    $.getJSON(full, function(data) {
        var translation = JSON.parse(data.contents)[0][0][0];

        translations.push({
            "translation": translation,
            "language": targetLanguage
        });

        clearTimeout(errorTimeout);
        updateLoadingbar();
        displayResults();
        translateLoop();
    }).error(function(data) {
        console.log(data);
    });
}


function translateLoop() {
    if (loopNum < maxLoops) {
        translate(undefined);
        loopNum++;
    } else if (loopNum == maxLoops) { //translate one more time back to english
        translate("en");
        loopNum++;
    }
}


function updateLoadingbar() {
    var steps = loopNum / (maxLoops + 1);
    var bar = document.querySelector(".bar");

    bar.innerHTML = "Loading...";
    bar.style.width = steps * 100 + "%";

    if (loopNum > maxLoops) {
        bar.innerHTML = "Done";
    }
}

function displayResults() {
    var resultsDiv = document.querySelector(".results");
    var last = translations.length - 1;

    resultsDiv.innerHTML = translations[last].translation;
}

document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    var input = event.target[0].value;

    finished = false;
    loopNum = 0;

    if (typeof input === "string" && input !== "") {
        //translate() translates the last variable in the array, so just set it to the new input
        translations = [{
            "translation": input,
            "language": "en"
        }];

        translateLoop();
    }
});

function stopTranslate() {
    shouldTranslate = false;
}

function alertError(error) {
    console.log("Error - Timeout");
}