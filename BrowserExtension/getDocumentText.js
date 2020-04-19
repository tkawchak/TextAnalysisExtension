// Get the webpage url
async function getWebpageUrl() {
  var url = window.location.href;
  console.log(`url: ${url}`)
  return url;
}

// Create a port to connect to the background script
console.log("Setting up content script connection to background script.");
var requestServicePort = browser.runtime.connect({ name: "port-from-content-script" });
requestServicePort.postMessage({ greeting: "hello from content script" });

// Create a listener for messages from the background script
requestServicePort.onMessage.addListener(async function (message) {
  console.log("In content script, received message from background script: ");

  if (message.status != undefined) {
    console.log("background script status");
    console.log(message.status);
  }
  else if (message.command != undefined && message.command == "analyze") {
    console.log(message.command);
    var webpageUrl = await getWebpageUrl();
    console.log("Sending URL to requestService background script for analysis...");
    console.log(webpageUrl);
    requestServicePort.postMessage({data: webpageUrl});
  }
  else {
    console.log("Unrecognized message");
    console.log(message);
  }
});

// log to the console if the connection cannot be established
requestServicePort.onDisconnect.addListener(function () { console.log("Connection failed."); });