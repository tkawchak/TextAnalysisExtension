// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights"

const axios = require('axios');

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
 * Get the webpage url from the current page
 */
function getWebpageUrl() {
  var url = window.location.href;
  return url;
}

/**
 * A listener that will handle any messages coming from the popup script
 * @param {*} message The message from the popup script
 */
async function popupScriptListener(message) {
  console.log(`In content script, received message from popup script: ${JSON.stringify(message)}`);

  var result = `Unrecognized command`;
  if (message.command != undefined) {
    command = message.command;
    if (command == "analyze")
    {
      console.log("In content script, processing web page");
      result = await processWebpage();
    }
    else if (command == "fetch")
    {
      console.log("In content script, fetching data for web page");
      result = await fetchWebpageData();
    }
    else {
      console.log(`In content script, received unrecognized command: ${command}`);
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
  }

  else if (message.fetchResult != undefined) {
    console.log(`In content script, background script fetch result: ${message.fetchResult}`);
  }

  else {
    console.warn(`In content script, Unrecognized message received from background script: '${JSON.stringify(message)}'`);
  }
}

/**
 * Send a webpage url to the request service for it to analyze
 * TODO: How to get this response data and send it back to the popup script?
 * Would it be possible to add a method that would query the data via azure functions to get the most recent copy at the specific URL?
 */
async function processWebpage() {
  console.log(`In content script, processing web page data`);
  var webpageUrl = getWebpageUrl();
  console.log(`In content script, sending URL to requestService background script for analysis: ${webpageUrl}`);
  requestServicePort.postMessage({ data: webpageUrl, command: "analyze" });

  var result = "Sent analyze command to process the web page data";
  return result;
}

async function fetchWebpageData() {
  console.log(`In content script, fetching web page data`);
  var webpageUrl = getWebpageUrl();
  console.log(`In content script, fetching webpage data from URL ${webpageUrl}`);
  requestServicePort.postMessage({ data: webpageUrl, command: "fetch" });

  var result = "sent fetch command to fetch web page data";
  return result;
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