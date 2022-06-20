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

const SECRETS = [
  'ProcessTextHttpFuncCode',
  'GetProcessedTextFuncCode',
  'ExtractTextFuncCode',
  'ComputeReadabilityFuncCode',
];
var functionCodes = {};

async function getSecretsAndThrowIfNotLoggedIn(functionCodes) {
  if (Object.keys(functionCodes).length === 0) {
    console.log(`[getDocumentText.js] Attempting to fetch function codes from auth service.`);
    let getSecretsResponse = await browser.runtime.sendMessage({ action: "getsecrets" });
    handleMesssageFromAuthService(getSecretsResponse);
  }
  if (Object.keys(functionCodes).length === 0) {
    console.warn(`[getDocumentText.js] Please login before analyzing a webpage.`);
    throw "Please login before analyzing a webpage.";
  }
}

/**
 * A listener that will handle any messages coming from the popup script
 * @param {*} message The message from the popup script
 */
async function popupScriptListener(message) {
  console.log(`[getDocumentText.js] received message from popup script: ${JSON.stringify(message)}`);

  var result = `Unrecognized command`;
  if (message.command != undefined) {
    command = message.command;

    switch (command) {

      case "analyze":
        console.log("[getDocumentText.js] Analyzing current webpage.");
        await getSecretsAndThrowIfNotLoggedIn(functionCodes);
        result = await client.processWebpage(functionCodes);
        break;

      case "fetch":
        console.log("[getDocumentText.js] Fetching data for current webpage.");
        await getSecretsAndThrowIfNotLoggedIn(functionCodes);
        result = await client.fetchWebpageData(functionCodes);
        break;

      case "analyze-selected":
        console.log("[getDocumentText.js] Analyzing selected text from current webpage.");
        await getSecretsAndThrowIfNotLoggedIn(functionCodes);
        result = await client.analyzeSelectedText(functionCodes);
        break;

      case "analyze-custom":
        console.log("[getDocumentText.js] Analyzing selected text from current webpage.");
        await getSecretsAndThrowIfNotLoggedIn(functionCodes);
        var text = message.text;
        result = await client.analyzeCustomText(text, functionCodes);
        break;

      case "login":
        console.log(`[getDocumentText.js] Logging in user. Fetching secrets ${SECRETS}`);
        let loginResponse = await browser.runtime.sendMessage({ action: "login" , secrets: SECRETS });
        result = handleMesssageFromAuthService(loginResponse);
        break;

      case "logout":
        console.log("[getdocumentText.js] Logging out.");
        let logoutResponse = await browser.runtime.sendMessage({ action: "logout" });
        result = handleMesssageFromAuthService(logoutResponse);
        break;

      default:
        console.log(`[getDocumentText.js]received unrecognized command: ${command}`);
        result = `Unexpected command ${command}`;
      }
  }

  return result;
}


// TODO: Separate this function into one for loginResults and one
// for logoutResults

/**
 * Handle messages from the auth service background script.
 * @param {*} message 
 */
function handleMesssageFromAuthService(message) {
  if (message.loginResult != undefined) {
    console.log(`[getDocumentText.js] Processing auth service login result ${message.loginResult}`);
    functionCodes = message.secrets;
    return message.user;
  }

  else if (message.logoutResult != undefined) {
    console.log(`[getDocumentText.js] Processing auth service logout result: ${message.logoutResult}`);
    return "logged out";
  }

  else if (message.getsecretsResult != undefined) {
    console.log(`[getDocumentText.js] Processing auth service getsecrets result: ${message.getsecretsResult}`);
    functionCodes = message.secrets;
    return "fetched secrets";
  }

  else {
    console.warn(`[getDocumentText.js] Unrecognized message received from auth service: '${JSON.stringify(message)}'`);
    return "Unexcpected response from auth service.";
  }
}

// Add a listener to handle messages from the popup script
browser.runtime.onMessage.addListener(popupScriptListener);
