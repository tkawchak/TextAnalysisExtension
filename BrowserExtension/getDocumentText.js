// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights"

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
async function getWebpageUrl() {
  var url = window.location.href;
  return url;
}

/**
 * A listener that will handle any messages coming from the popup script
 * @param {*} message The message from the popup script
 */
function popupScriptListener(message) {
  console.log(`In content script, received message from popup script: ${JSON.stringify(message)}`);

  if (message.command != undefined) {
    command = message.command;
    if (command == "analyze")
    {
      console.log("In content script, processing web page");
      processWebpage();
    }
    else {
      console.log(`In content script, received unrecognized command: ${command}`);
    }
  }
}

browser.runtime.onMessage.addListener(popupScriptListener);

// Create a port to connect to the background script
console.log("Setting up content script connection to background script.");
var requestServicePort = browser.runtime.connect({ name: "port-from-content-script" });
requestServicePort.postMessage({ greeting: "hello from content script" });

// Create a listener for messages from the background script
requestServicePort.onMessage.addListener(async function (message) {
  console.log(`In content script, received message from background script: ${JSON.stringify(message)}`);

  if (message.status != undefined) {
    console.log(`In content script, background script status: ${message.status}`);
  }
  // else if (message.command != undefined && message.command == "analyze") {
  //   console.log(`In content script, received background script command: ${message.command}`);
  //   var webpageUrl = await getWebpageUrl();
  //   console.log(`In content script, sending URL to requestService background script for analysis: ${webpageUrl}`);
  //   requestServicePort.postMessage({data: webpageUrl});
  // }
  else {
    console.log(`In content script, Unrecognized message received from background script: '${JSON.stringify(message)}'`);
  }
});

async function processWebpage() {
  console.log(`In content script, processing text`);
  var webpageUrl = await getWebpageUrl();
  console.log(`In content script, sending URL to requestService background script for analysis: ${webpageUrl}`);
  requestServicePort.postMessage({ data: webpageUrl });
}

// log to the console if the connection cannot be established
requestServicePort.onDisconnect.addListener(function () { console.log("In content script, Connection to background script failed."); });

function listenForClicks() {
  console.log("listening for clicks");
  console.log(`document title: ${document.title}`);
  document.addEventListener("click", (e) => {
    console.log("In content script, something was clicked");
    if (e.target.classList.contains("analyze-button")) {
      console.log("In content script, analyze button was clicked");
      processWebpage();
      // browser.runtime.sendMessage({ "command": "analyze" });
    }
  });
}

listenForClicks();
