const msal = require("@azure/msal-browser");
const {login, logout} = require("./msalUtils.js");

const AUTHORITY = 'https://login.microsoftonline.com/common/';
const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = "6d02128a-1f5c-450c-8861-54d0aee8a155";

// Set the redirect URI to the chromiumapp.com provided by firefox
console.log(`[auth.js] Extension extension redirect URI set to ${REDIRECT_URL}`);

// TODO: See this article for more on the authentication issues.
// https://stackoverflow.com/questions/63534275/how-to-get-the-identity-launchwebauthflow-to-work-from-a-browser-extension-popup
// The auth needs to happen from the background script and not the popup script,
// so we will need to send messages to the background script to perform the login

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URL,
    postLogoutRedirectUri: REDIRECT_URL,
  },
  cache: {
    cacheLocation: "localStorage"
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
var authPort;

// Add a listener for the function run when the content script
// wants to connect to the function
console.log(`[auth.js] Adding listener for incoming connections.`);
browser.runtime.onConnect.addListener(connected);

// Set currently logged in account
const accounts = msalInstance.getAllAccounts();
if (accounts.length) {
  console.log(`[auth.js] accounts is not empty. First value: ${accounts[0].username}`);
}
else {
  console.log(`[auth.js] accounts is empty`);
}

// Function to handle to auth requests
async function handleAuthMessage(message) {
  console.log("[auth.js] [authBackend.js] Received message");

  // In order to send a message back on the port:
  // authPort.postMessage({ greeting: "hello from content script" });

  if (message.action != undefined) {
    var action = message.action;

    console.log(`[auth.js] Action: ${action}`)
    switch (action) {
      case "login": login(msalInstance);
        break;
      case "logout": logout(msalInstance);
        break;
      default:
        console.warn(`Action ${action} not recognized.`);
    }

    // Send auth response back
    var responseMessage = `Executed command ${action}`;
    authPort.postMessage({ status: responseMessage });
  }
}

// Function to execute when the background script receives an event to connect
// to the main content script
function connected(port) {
  console.log("[auth.js] Received connection request. Adding auth message handler.");
  authPort = port;
  authPort.onMessage.addListener(handleAuthMessage);
}
