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
  var predicted = document.getElementById("predicted");

  while (resultList.lastElementChild) {
    resultList.removeChild(resultList.lastElementChild);
  }

  summary.value = "";
  predicted.value = "";
  hideElementById("summary-section");
  hideElementById("predicted-section");
}

function showElementById(id) {
  var element = document.getElementById(id);
  element.removeAttribute("hidden");
}

function hideElementById(id) {
  var element = document.getElementById(id);
  element.setAttribute("hidden", true);
}

/**
 * Show the loading status
 */
function showLoadingStatus() {
  console.log("[menu_actions.js] Showing loading status");
  showElementById("loading-status");
}

/**
 * Hide the loading status
 */
function hideLoadingStatus() {
  console.log("[menu_actions.js] Hiding loading status");
  hideElementById("loading-status");
}

/**
 * Show that a given user is logged in
 * @param {string} user The user to display as logged in
 */
function showLoggedInUser(user) {
  console.log(`[menu_actions.js] Showing logged in user ${user}`);
  var loggedInUser = document.getElementById("logged-in-user");
  loggedInUser.innerHTML = user;
  hideElementById("login");
  showElementById("logout");
}

/**
 * Show a status that no user is logged in
 */
function showLoggedOutStatus() {
  console.log("[menu_actions.js] Setting status to logged out");
  var loggedInUser = document.getElementById("logged-in-user");
  loggedInUser.innerHTML = "N/A";
  hideElementById("logout");
  showElementById("login");
}

/**
 * Display analysis results for a webpage
 * @param {*} response response from an analysis action
 */
function displayAnalysisResults(response) {
  // Clear the existing results
  clearCurrentAnalysisResults();
  hideLoadingStatus();

  // Get the desired element for result items
  var summary = document.getElementById("summary");
  var predicted = document.getElementById("predicted");
  var resultList = document.getElementById("result-items");
  var keysToDisplay = ["author", "overall_score", "sentence_count", "syllable_count", "difficult_words", "average_sentence_length",
    "coleman_liau_index", "dale_chall_readability_score", "flesch_ease", "fleschkincaid_grade", "gunning_fog_index", "lexicon_count", "linsear_write_index",
    "lix_readability_index", "smog_index"];

  // display the summary
  if (response.hasOwnProperty("summary") && response["summary"] != null) {
    console.log(`[menu_actions.js] summary: ${response["summary"]}`);
    summary.innerHTML = response["summary"];
    showElementById("summary-section");
  }
  else {
    console.warn("Summary has not been computed yet.");
  }

  // display the predicted text
  if (response.hasOwnProperty("predicted") && response["predicted"] != null) {
    console.log(`[menu_actions.js] predicted: ${response["predicted"]}`)
    predicted.innerHTML = response["predicted"]
    showElementById("predicted-section");
  }
  else {
    console.warn("Predicted Text has not been computed yet.");
  }

  // display the new result items
  for (var i = 0; i < keysToDisplay.length; i++) {
    var key = keysToDisplay[i];
    if (response[key] == null || response[key] == "") {
      console.warn(`[menu_actions.js] No value for key ${key}`);
      continue;
    }

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

/**
 * Display explain results for a webpage
 * @param {*} response response from an explain action - just the plain text
 */
function displayExplainResults(response) {
  // Clear the existing results
  clearCurrentAnalysisResults();
  hideLoadingStatus();

  // display the explanation
  console.log(`[menu_actions.js] explanation: ${response}`);
  var explanation = document.getElementById("explain");
  explanation.innerHTML = response;
  showElementById("explain-section");
}

// TODO: Add some handling to the handleAnalyzeResult and handleFetchResult functions if there are no results yet
// or if there is problem getting the results

/**
 * Handle the response from analyzing the current web page and display the results
 * @param {*} response response from an analyze action
 */
function handleAnalyzeResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`[menu_actions.js] Received response from analyze command: ${responseText}`);
  displayAnalysisResults(response);
}

/**
 * Handle the response from explaining the current text and display the results
 * @param {*} response response from an explain action
 */
function handleExplainResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`[menu_actions.js] Received response from explain command: ${responseText}`);
  displayExplainResults(response);
}

/**
 * Handle the response from fetching the current web page data
 * @param {*} response The response from a fetch action
 */
function handleFetchResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`[menu_actions.js] Received response from fetch command: ${responseText}`);
  displayAnalysisResults(response);
}

/**
 * Handle the response from logging in 
 * @param {*} response The response from a login action
 */
function handleLoginResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`[menu_actions.js] Received response from login command: ${responseText}`);
  hideLoadingStatus();
  showLoggedInUser(response);
}

/**
 * Handle the response from logging out
 * @param {*} response The response from a logout action
 */
function handleLogoutResult(response) {
  var responseText = JSON.stringify(response);
  console.log(`[menu_actions.js] Received response from logout command: ${responseText}`);
  hideLoadingStatus();
  showLoggedOutStatus();
}

/**
 * Logs the error message
 * @param {*} error The error message
 */
function logError(error) {
  hideLoadingStatus();
  var errorElement = document.querySelector("#error-message");
  errorElement.innerHTML = error.message;
  showElementById("error-content");
  console.error(`[menu_actions.js] Received error: ${error}`);
}

/**
 * Clear the error message so that it does not show up anymore
 */
function hideError() {
  console.log("[menu_actions.js] Clearing error message");
  var errorElement = document.querySelector("#error-message");
  errorElement.innerHTML = "";
  hideElementById("error-content");
  console.log("[menu_actions.js] Cleared error message");
}

/**
 * Send a command to the content script to analyze the current page
 * @param {*} tabs The list of tab.Tab objects from firefox api
 */
function sendAnalyzeCommandToContentScript(tabs) {
  // Here we loop through all of the tabs
  // but there is really only one tab because the tab must be active
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending analyze command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "analyze" })
      .then(handleAnalyzeResult)
      .catch(logError);
  }
}

/**
 * Send a command to fetch the data for the current webpage
 * @param {*} tabs the tabs to send the command to
 */
function sendFetchCommandToContentScript(tabs) {
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending fetch command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "fetch" })
      .then(handleFetchResult)
      .catch(logError);
  }
}

/**
 * Send a command to analyze the text that is selected on the webpage.
 * @param {*} tabs the tabs to send the command to
 */
function sendAnalyzeSelectedCommandToContentScript(tabs) {
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending analyze-selected command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "analyze-selected" })
      .then(handleAnalyzeResult)
      .catch(logError);
  }
}

/**
 * Send a command to explain the text that is selected on the webpage.
 * @param {*} tabs the tabs to send the command to
 */
function sendExplainSelectedCommandToContentScript(tabs) {
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending explain-selected command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "explain-selected" })
      .then(handleExplainResult)
      .catch(logError);
  }
}

/**
 * Send a command to login to the content script.
 * @param {*} tabs the tabs to send the command to
 */
function sendLoginCommandToContentScript(tabs) {

  clearCurrentAnalysisResults();
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending login command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "login" })
      .then(handleLoginResult)
      .catch(logError);
  }
}

/**
 * Send a command to logout of the content script.
 * @param {*} tabs the tabs to send the command to
 */
function sendLogoutCommandToContentScript(tabs) {
  clearCurrentAnalysisResults();
  showLoadingStatus();
  for (var tab of tabs) {
    console.log(`[menu_actions.js] Sending logout command to tab with id ${tab.id}`);
    browser.tabs.sendMessage(tab.id, { "command": "logout" })
      .then(handleLogoutResult)
      .catch(logError);
  }
}

/**
 * Show the buttons for analyzing custom text fields
 */
function showAnalyzeCustomTextFields() {
  clearCurrentAnalysisResults();
  var itemsToHide = document.getElementsByClassName("show-default");
  for (var i = 0; i < itemsToHide.length; i++) {
    itemsToHide[i].setAttribute("hidden", true);
  }

  var itemsToShow = document.getElementsByClassName("analyze-custom-text");
  for (var i = 0; i < itemsToShow.length; i++) {
    itemsToShow[i].removeAttribute("hidden");
  }
}

/**
 * Analyze custom text field box
 */
async function analyzeCustomText(tabs) {
  var text = document.getElementById("custom-text-box").value;
  if (text == null || text.trim() == '') {
    showAnalyzeCustomTextFields();
  }

  else {
    for (var tab of tabs) {
      console.log(`[menu_actions.js] Custom text: ${text}`);
      console.log(`[menu_actions.js] Sending analyze custom text command to tab with id ${tab.id}`)
      browser.tabs.sendMessage(tab.id, { "command": "analyze-custom", "text": text })
        .then(handleAnalyzeResult)
        .catch(logError);
    }
  }
}

/**
 * show the default menu options
 */
function showDefaultMenu() {
  clearCurrentAnalysisResults();
  hideLoadingStatus();
  var showDefaultItems = document.getElementsByClassName("show-default");
  var hideDefaultItems = document.getElementsByClassName("hide-default");
  var customTextBox = document.getElementById("custom-text-box");

  for (var i = 0; i < showDefaultItems.length; i++) {
    showDefaultItems[i].removeAttribute("hidden");
  }
  for (var i = 0; i < hideDefaultItems.length; i++) {
    hideDefaultItems[i].setAttribute("hidden", true);
  }

  customTextBox.value = "";
}

/**
 * Listen for clicks in the popup page.
 * Determine what action to take depending on what button was clicked
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log(`[menu_actions.js] Clicked! Id: ${e.target.id}`);
    hideError();
    var activeTab = browser.tabs.query({
      currentWindow: true,
      active: true
    });

    // figure out which button was clicked and take appropriate action
    switch (e.target.id) {

      case "analyze-webpage-button":
        console.log("[menu_actions.js] Analyze Webpage button was clicked.");
        activeTab
          .then(sendAnalyzeCommandToContentScript)
          .catch(logError);
        break;

      case "fetch-webpage-button":
        console.log("[menu_actions.js] Fetch Webpage data button was clicked.");
        activeTab
          .then(sendFetchCommandToContentScript)
          .catch(logError);
        break;

      case "analyze-text-button":
        console.log("[menu_actions.js] Analyze Custom Text button was clicked.");
        activeTab
          .then(analyzeCustomText)
          .catch(logError);
        break;

      case "analyze-selected-button":
        console.log("[menu_actions.js] Analyze Selected Text button was clicked.");
        activeTab
          .then(sendAnalyzeSelectedCommandToContentScript)
          .catch(logError);
        break;

      case "explain-selected-button":
        console.log("[menu_actions.js] Explain Selected Text button was clicked.");
        activeTab
          .then(sendExplainSelectedCommandToContentScript)
          .catch(logError);
        break;

      case "back-button":
        console.log("[menu_actions.js] Back button was clicked.");
        showDefaultMenu();
        break;

      case "login":
        console.log("[menu_actions.js] Login was clicked.");
        activeTab
          .then(sendLoginCommandToContentScript)
          .catch(logError);
        // TODO: How to handle if the login fails?
        break;

      case "logout":
        console.log("[menu_actions.js] Logout was clicked.");
        activeTab
          .then(sendLogoutCommandToContentScript)
          .catch(logError);
        // TODO: How to handle if the logout fails?
        break;

      default:
        console.log(`[menu_actions.js] Unhandled button was clicked with id ${e.target.id}`);
        break;
    }
  });
  return;
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  hideElementById("popup-content");
  showElementById("error-content");
  console.error(`[menu_actions.js] Failed to execute content script: ${error.message}`);
}

showDefaultMenu();

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
console.log("[menu_actions.js] Loading the getDocumentText content script.");
browser.tabs.executeScript({ file: "/getDocumentText.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

console.log("[menu-actions.js] Checking if user is already logged in.");
let getUserResponse = await browser.runtime.sendMessage({ action: "getuser" });
if (getUserResponse.user != "") {
  showLoggedInUser(getUserResponse.user);
} else {
  showLoggedOutStatus();
}
