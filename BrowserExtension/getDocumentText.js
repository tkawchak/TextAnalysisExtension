// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights"

const client = require('./client.js');

// Load the request library for making http requests
/**
 * Check and set a global guard variable.
 * If this content script is injected into the same page again,
 * it will do nothing next time.
 */
if (window.hasRun) {
  return;
}
window.hasRun = true;

/**
 * A listener that will handle any messages coming from the popup script
 * @param {*} message The message from the popup script
 */
async function popupScriptListener(message) {
  console.log(`In content script, received message from popup script: ${JSON.stringify(message)}`);

  var result = `Unrecognized command`;
  if (message.command != undefined) {
    command = message.command;
    if (command == "analyze") {
      console.log("[getDocumentText.js] Analyzing current webpage.");
      result = await client.processWebpage();
    }
    else if (command == "fetch") {
      console.log("[getDocumentText.js] Fetching data for current webpage.");
      result = await client.fetchWebpageData();
    }
    else if (command == "analyze-selected") {
      console.log("[getDocumentText.js] Analyzing selected text from current webpage.");
      result = await client.analyzeSelectedText();
    }
    else {
      console.log(`[getDocumentText.js]received unrecognized command: ${command}`);
    }
  }

  return result;
}

/**
 * Handle messages from the request service background script.
 * @param {*} message 
 */
async function handleMesssageFromRequestService(message) {
  console.log(`In content script, received message from background script: ${JSON.stringify(message)}`);

  if (message.analyzeResult != undefined) {
    console.log(`In content script, background script analyze result: ${message.analyzeResult}`);
    insertDataIntoWebpage(message.analyzeResult);
  }

  else if (message.fetchResult != undefined) {
    console.log(`In content script, background script fetch result: ${message.fetchResult}`);
    insertDataIntoWebpage(message.fetchResult);
  }

  else {
    console.warn(`In content script, Unrecognized message received from background script: '${JSON.stringify(message)}'`);
  }
}

/**
 * Log a disconnect event error message
 */
function logDisconnect() {
  console.error("In content script, Connection to background script failed.");
}

// Add a listener to handle messages from the popup script
browser.runtime.onMessage.addListener(popupScriptListener);

// Create a port to connect to the background script
console.log("In content script, Setting up content script connection to background script.");
var requestServicePort = browser.runtime.connect({ name: "port-from-content-script" });
// handle disconnections of the port to background script
requestServicePort.onDisconnect.addListener(logDisconnect);

// Create a listener for messages from the background script on the specified port
requestServicePort.onMessage.addListener(handleMesssageFromRequestService);