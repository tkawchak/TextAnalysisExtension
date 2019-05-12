// Load the request library for making http requests
const request = require('request');

// Port to hold the connection to the content script
var getDocumentTextPort;

// Check to see if the connection has been set up and if so then
// send a message to request the site data.
function sendAnalyzeCommand() {
  if (getDocumentTextPort != undefined) {
    getDocumentTextPort.postMessage({ command: "analyze" });
    console.log("Sent Analyze command to content script.");
  }
  else {
    console.log("The content script port has not been initialized yet.");
  }
}

// Send a request to the azure function with the properly formatted data.
function sendRequest(name, url, grade, score, wordCount) {
  if (name == null || url == null || grade == null || score == null || wordCount == null) {
    console.log("All values were null.");
    return null;
  }
  var documentTitle = name;
  var documentUrl = url;
  var documentGrade = grade;
  var documentScore = score;
  var documentWordCount = wordCount;
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
  alert("In background script, received message from content script.");
  if (getDocumentTextPort != undefined) {
    getDocumentTextPort.postMessage({ status: "Received message from content script"});
  }

  // perform the request to send the data
  if (message.data != undefined) {
    console.log(message.data);
    sendRequest(
      message.data.name,
      message.data.url,
      message.data.grade,
      message.data.score,
      message.data.wordCount
    );

    getDocumentTextPort.postMessage({status: "send data to azure function."});
  }
}

// Listener for the extension button clicked
browser.browserAction.onClicked.addListener(sendAnalyzeCommand);

// Function to execute when the background script receives an event to connect
// to the main content script
function connected(port) {
  getDocumentTextPort = port;
  getDocumentTextPort.onMessage.addListener(handleMessage);
}

// Add a listener for the function run when the content script
// wants to connect to the function
browser.runtime.onConnect.addListener(connected);