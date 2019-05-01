// Load the Flesch-Kincaid Library
var FleschKincaid = require("flesch-kincaid");
var WordCount = require("wordcount");

// Load the request library for making http requests
const request = require('request');

// Analyze the web page text and send it to the server
function analyzeWebpage() {
    // read the text content of the web page
    var documentText = document.body.textContent;
    var documentUrl = window.location.href;
    var documentTitle = document.title;

    // Calculate the webpage attributes
    var documentGrade = FleschKincaid.grade(documentText);
    var documentScore = FleschKincaid.rate(documentText);
    var documentWordCount = WordCount(documentText)

    // log the document text
    // console.log(documentText);
    console.log(`Document title: ${documentTitle}`);
    console.log(`Document URL: ${documentUrl}`);
    console.log(`Flesch-Kincaid document text grade: ${documentGrade}`);
    console.log(`Flesch-Kincaid document text rating: ${documentScore}`);
    console.log(`Word count for document text: ${documentWordCount}`);

    // send a request to the azure function
    request({
        uri: "https://tkawchak-textanalysis.azurewebsites.net/api/HttpTrigger1",
        method: "GET",
        timeout: 10000,
        qs: {
            code: "HZcgMXeKKoZ92cnvsqAFMDKBVnP4cDBZ5mEcwKsgOGWfFEpsiQmGUg==",
            name: documentTitle,
            url: documentUrl,
            grade: documentGrade,
            score: documentScore,
            count: documentWordCount
        }
    }, function (error, response, body) {
        console.log("ERROR: ", error)
        console.log("RESPONSE STATUS CODE: ", response && response.statusCode);
        console.log("RESPONSE BODY: ", body);
    });
}

// Create a port to connect to the background script
console.log("Setting up content script connection to background script.");
var requestServicePort = browser.runtime.connect({name:"port-from-content-script"});
// TODO: Figure out why this connection doesn't work??
requestServicePort.postMessage({greeting: "hello from content script"});

// Create a listener for messages from the background script
myPort.onMessage.addListener(function(message) {
  console.log("In content script, received message from background script: ");
  console.log(message.command);
});