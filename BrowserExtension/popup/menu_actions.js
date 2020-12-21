// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights.js"

function displayAnalysisResults(response) {
  // Get the desired element for result items
  var summary = document.getElementById("summary");
  var resultList = document.getElementById("result-items");
  var keysToDisplay = ["author", "overall_score", "sentence_count", "processed_time", "syllable_count", "difficult_words", "average_sentence_length", 
    "coleman_liau_index", "dale_chall_readability_score", "flesch_ease", "fleschkincaid_grade", "gunning_fog_index", "lexicon_count", "linsear_write_index",
    "lix_readability_index", "smog_index"];

  // clear the result items
  while (resultList.lastElementChild) {
    resultList.removeChild(resultList.lastElementChild);
  }

  // display the summary
  if (response.hasOwnProperty("summary"))
  {
    console.log(`[menu_actions.js] summary: ${response["summary"]}`);
    summary.innerHTML = response["summary"]
  }
  else
  {
    console.warn("Summary has not been computed yet.");
  }

  // display the new result items
  for (var i=0; i < keysToDisplay.length; i++)
  {
    var key = keysToDisplay[i];
    console.log(`Creating response item for key ${key}`);
    var newKey = document.createElement("div");
    newKey.className = "result-key";
    newKey.innerHTML = `${key}: `;
    var newValue = document.createElement("div");
    newValue.className = "result-value";
    newValue.innerHTML = response[key];
    var newItem = document.createElement("div");
    newItem.className = "result";
    newItem.appendChild(newKey);
    newItem.appendChild(newValue);
    resultList.appendChild(newItem);
  }
}

// TODO: Add some handling to the handleAnalyzeResult and handleFetchResult functions if there are no results yet
// or if there is problem getting the results

/**
 * Handle the response from analyzing the current web page and display the results
 * @param {*} response 
 */
function handleAnalyzeResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`In popup script, recieved response from analyze command: ${responseText}`);
  displayAnalysisResults(response);
}

/**
 * Handle the response from fetching the current web page data
 * @param {*} response 
 */
function handleFetchResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`In popup script, recieved response from fetch command: ${responseText}`);
  displayAnalysisResults(response);
}

/**
 * Logs the error message
 * @param {*} error The error message
 */
function logError(error) {
  var errorElement = document.querySelector("#error-message");
  errorElement.innerHTML = error.message;
  var errorContent = document.querySelector("#error-content");
  errorContent.classList.remove("hidden");
  console.error(`In popup script, received error: ${error}`);
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

function sendFetchCommandToContentScript(tabs) {
  for (var tab of tabs)
  {
    console.log(`In popup script, sending fetch command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "fetch" })
      .then(handleFetchResult)
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
    else if (e.target.classList.contains("fetch-button")) {
      console.log("In popup script, fetch button was clicked");
      browser.tabs.query({
        currentWindow: true,
        active: true
      })
        .then(sendFetchCommandToContentScript)
        .catch(logError);
    }
    return;
  });

  return;
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
