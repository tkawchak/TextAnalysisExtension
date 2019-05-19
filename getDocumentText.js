// Load the Flesch-Kincaid Library
var FleschKincaid = require("flesch-kincaid");
var WordCount = require("wordcount");

// Get the webpage data from the webpage and format it as json
function getWebpageData() {
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
  // console.log(`Document title: ${documentTitle}`);
  // console.log(`Document URL: ${documentUrl}`);
  // console.log(`Flesch-Kincaid document text grade: ${documentGrade}`);
  // console.log(`Flesch-Kincaid document text rating: ${documentScore}`);
  // console.log(`Word count for document text: ${documentWordCount}`)

  return {
    name: documentTitle,
    url: documentUrl,
    grade: documentGrade,
    score: documentScore,
    wordCount: documentWordCount
  }
}

// Create a port to connect to the background script
console.log("Setting up content script connection to background script.");
var requestServicePort = browser.runtime.connect({ name: "port-from-content-script" });
requestServicePort.postMessage({ greeting: "hello from content script" });

// Create a listener for messages from the background script
requestServicePort.onMessage.addListener(function (message) {
  console.log("In content script, received message from background script: ");

  if (message.status != undefined) {
    console.log("background script status");
    console.log(message.status);
  }
  else if (message.command != undefined && message.command == "analyze") {
    console.log(message.command);
    var webpageData = getWebpageData();
    console.log("Sending the webpage data...");
    console.log(webpageData);
    requestServicePort.postMessage({data: "data"});
    requestServicePort.postMessage({data: webpageData});
  }
  else {
    console.log("Unrecognized message");
    console.log(message);
  }
});

// log to the console if the connection cannot be established
requestServicePort.onDisconnect.addListener(function () { console.log("Connection failed."); });