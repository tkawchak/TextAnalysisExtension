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

function insertDataIntoWebpage(data) {
  console.log(`Inserting data into webpage`);
  console.log(`Document text is editable: ${document.body.isContentEditable}`);
  console.log(`Document text content: ${document.body.textContent}`);
  var dataSection = document.createElement('p');
  dataSection.textContent = JSON.stringify(data);
  console.log(`Document before prepend: ${document.body.childNodes}`);
  document.body = dataSection;
  console.log(`Document after prepend: ${document.body.childNodes}`);
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

// async function fetchWebpageData() {
//   console.log(`In content script, fetching web page data`);
//   var webpageUrl = getWebpageUrl();
//   console.log(`In content script, fetching webpage data from URL ${webpageUrl}`);
//   requestServicePort.postMessage({ data: webpageUrl, command: "fetch" });

//   var result = "sent fetch command to fetch web page data";
//   return result;
// }
/**
 * Function to get web page data form a url.
 * Calls and api that parses the webpage text and then runs readability metrics on them.
 * 
 * @param {*} url The url to get webpage data from
 */
async function getWebpageData(url) {
  console.log(`In background script, Retrieving webpage data for ${url}`);
  var code = `s23M3iar2EJ9iyXfPVeHWQtCRD6BO0cTI87YtvDhnAkVawaoVTCpAw==`;
  var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?url=${url}&code=${code}`;
  // var requestUrl = `http://localhost:7072/api/ExtractText?url=${url}&code=${code}`;
  var webpageData = {};
  try {
    console.log("In background script, sending request to get webpage data");
    const webpageDataResponse = await axios.get(requestUrl);
    if (webpageDataResponse.status == 200) {
      console.log("In background script, processed web page text successfully");
      webpageData = webpageDataResponse.data;
    }
    else {
      console.log(`In background script, Unable to process webpage data.  ExtractText Status Code: ${webpageDataResponse.status}`);
    }
  } catch (error) {
    console.error(error);
  }

  return webpageData;
}

/**
 * Fetch the data for a webpage
 */
async function fetchWebpageData() {
  var url = getWebpageUrl();
  console.log(`In content script, fetching webpage data from URL ${url}`);
  try {
    webpageData = await getWebpageData(url);
  } catch (error) {
    console.log(error);
  }
  
  console.log(`In content script, fetching data for webpage ${webpageData.url}`);
  var code = "2ufJzrhP9OYCE6gl/afIMsIVyOm/azxo0Z5ChDQzxLXmY0GAaFP0xg==";
  var title = webpageData.title;
  var domain = webpageData.domain;
  // var requestUrl = `https://processtext.azurewebsites.net/api/GetProcessedText?d=${title}&domain=${domain}&code=${code}`;
  var requestUrl = `http://localhost:7071/api/GetProcessedText?id=${title}&domain=${domain}&code=${code}`;
  var response;
  try {
    response = await axios.get(requestUrl);
    console.log(`Response code: ${response.status}`);
    console.log(`Response body: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error(error);
  }

  if (response.status == 200) {
    console.log("In content script, Successfully fetched data from webpage.");
    return response.data;
  }
  else {
    console.log(`In content script, Unable to fetch data from webpage. GetProcessedText Response Code: ${response.status}`);
    return {};
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