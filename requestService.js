// Load the request library for making http requests
const request = require('request');

// Port to hold the connection to the content script
var getDocumentTextPort;

function sendAnalyzeCommand() {
  if (getDocumentTextPort != undefined) {
    getDocumentTextPort.postMessage({command: "analyze"});
    console.log("Sent Analyze command to content script.");
  }
  else {
      console.log("The content script port has not been initialized yet.");
  }
}

function sendRequest() {
  var documentTitle = "Background Test";
  var documentUrl = "example.com";
  var documentGrade = "2";
  var documentScore = "72.39";
  var documentWordCount = "12398123";
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
    console.log("ERROR: ", error);
    console.log("RESPONSE STATUS CODE: ", response && response.statusCode);
    console.log("RESPONSE BODY: ", body);
  });
}

// Function to handle to response messages from the content script
function handleMessage(message) {
  console.log("In background script, received message from content script: ");
  console.log(message);
}

// Listener for the extension button clicked
browser.browserAction.onClicked.addListener(sendAnalyzeCommand);

// Function to execute when the background script receives an event to connect
// to the main content script
function connected(port) {
  getDocumentTextPort = port;
  getDocumentTextPort.onMessage.addListener(handleMessage(message));
}

// Add a listener for the function run when the content script
// wants to connect to the function
browser.runtime.onConnect.addListener(connected);