// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights.js"
const client = require("../client.js");

/**
 * Clear the current analysis results
 */
function clearCurrentAnalysisResults() {
  // clear the result items
  console.log("[menu_actions.js] Clearing all existing analysis results");
  var resultList = document.getElementById("result-items");
  var summary = document.getElementById("summary");
  var summarySection = document.getElementById("summary-section");

  while (resultList.lastElementChild) {
    resultList.removeChild(resultList.lastElementChild);
  }

  summary.value = "";
  summarySection.classList.add("hidden");
}

/**
 * Display analysis results for a webpage
 * @param {*} response response from an analysis action
 */
function displayAnalysisResults(response) {
  // Clear the existing results
  clearCurrentAnalysisResults();

  // Get the desired element for result items
  var summary = document.getElementById("summary");
  var summarySection = document.getElementById("summary-section");
  var resultList = document.getElementById("result-items");
  var keysToDisplay = ["author", "overall_score", "sentence_count", "syllable_count", "difficult_words", "average_sentence_length", 
    "coleman_liau_index", "dale_chall_readability_score", "flesch_ease", "fleschkincaid_grade", "gunning_fog_index", "lexicon_count", "linsear_write_index",
    "lix_readability_index", "smog_index"];

  // display the summary
  if (response.hasOwnProperty("summary") && response["summary"] != null)
  {
    console.log(`[menu_actions.js] summary: ${response["summary"]}`);
    summary.innerHTML = response["summary"]
    summarySection.classList.remove("hidden");
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
 * @param {*} response response from an analyze action
 */
function handleAnalyzeResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`In popup script, recieved response from analyze command: ${responseText}`);
  displayAnalysisResults(response);
}

/**
 * Handle the response from fetching the current web page data
 * @param {*} response The response from a fetch action
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

/**
 * 
 * @param {*} tabs the tabs to send the command to
 */
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
 * Show the buttons for analyzing custom text fields
 */
function showAnalyzeCustomTextFields() {
  clearCurrentAnalysisResults();
  var itemsToHide = document.getElementsByClassName("show-default");
  for (var i=0; i < itemsToHide.length; i++) {
    itemsToHide[i].setAttribute("hidden", true);
  }

  var itemsToShow = document.getElementsByClassName("analyze-custom-text");
  for (var i=0; i < itemsToShow.length; i++) {
    itemsToShow[i].removeAttribute("hidden");
  }
}

/**
 * Analyze custom text field box
 */
async function analyzeCustomText() {
  var text = document.getElementById("custom-text-box").value;
  if (text == null || text.trim() == '') {
    showAnalyzeCustomTextFields();
  }
  else {
    console.log(`[menu_actions.js] Custom text: ${text}`);
    // TODO: Sanitize this input
    var textAnalysisResult = await client.computeReadability(text);
  }

  displayAnalysisResults(textAnalysisResult);
}

/**
 * 
 */
async function analyzeSelectedText() {
  return;
}

/**
 * show the default menu options
 */
function showDefaultMenu() {
  clearCurrentAnalysisResults();
  var defaultItems = document.getElementsByClassName("show-default");
  var customTextSection = document.getElementById("custom-text");
  var customTextBox = document.getElementById("custom-text-box");
  var backButton = document.getElementById("back-button");

  for (var i=0; i < defaultItems.length; i++) {
    defaultItems[i].removeAttribute("hidden");
  }

  customTextBox.value = "";
  customTextSection.setAttribute("hidden", true);
  backButton.setAttribute("hidden", true);
}

/**
 * Listen for clicks in the popup page.
 * Determine what action to take depending on what button was clicked
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log(`[menu_actions.js] Clicked! Id: ${e.target.id}`);
    var activeTab = browser.tabs.query({
      currentWindow: true,
      active: true
    });

    if (e.target.id == "analyze-webpage-button") {
      console.log("[menu_actions.js] Analyze Webpage button was clicked");
      activeTab
        .then(sendAnalyzeCommandToContentScript)
        .catch(logError);
    }
    else if (e.target.id == "fetch-webpage-button") {
      console.log("[menu_actions.js] Fetch Webpage data button was clicked");
      activeTab
        .then(sendFetchCommandToContentScript)
        .catch(logError);
    }
    else if (e.target.id == "analyze-text-button") {
      console.log("[menu_actions.js] Analyze Custom Text button was clicked");
      analyzeCustomText();
    }
    else if (e.target.id == "analyze-selected-button") {
      console.log("[menu_actions.js] Analyze Selected Text button was clicked.");
      activeTab
        .then(analyzeSelectedText)
        .catch(logError);
    }
    else if (e.target.id == "back-button") {
      console.log("[menu_actions.js] Back button was clicked");
      showDefaultMenu();
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
