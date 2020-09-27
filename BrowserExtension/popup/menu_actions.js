// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights.js"

/**
 * Handle the response from analyzing the current web page
 * @param {*} response 
 */
function handleAnalyzeResult(response) {
  console.log(`In popup script, recieved response from analyze command: ${JSON.stringify(response)}`);
  // TODO: Here we should take the results from analyzing the web page and display them in the popup window
}

/**
 * Logs the error message
 * @param {*} error The error message
 */
function logError(error) {
  console.error(`In popup script received error: ${error}`);
}

/**
 * Send a command to the content script to analyze the current page
 * @param {*} tabs The list of tab.Tab objects from firefox api
 */
function sendAnalyzeCommandToContentScript(tabs) {
  // Here we loop through all of the tabs
  // but there is really only one tab because the tab must be active
  for (var tab of tabs)
  {
    console.log(`In popup script, sending analyze command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "analyze" })
      .then(handleAnalyzeResult)
      .catch(logError);
  }
}

/**
 * Listen for clicks in the popup page.
 * Determine what action to take depending on what button was clicked
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("analyze-button")) {
      console.log("In popup script, analyze button was clicked");
      browser.tabs.query({
        currentWindow: true,
        active: true
      })
        .then(sendAnalyzeCommandToContentScript)
        .catch(logError);
    }
    return;
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
console.log("In popup script, loading the getDocumentText content script");
browser.tabs.executeScript({file: "/getDocumentText.bundle.js"})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
