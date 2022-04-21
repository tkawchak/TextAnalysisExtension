const msal = require("@azure/msal-browser");
const axios = require('axios');
const { login, logout, acquireToken } = require("./msalUtils.js");

const KEYVAULT_NAME= "textanalysis-kv";
const KEYVAULT_URL = `https://${KEYVAULT_NAME}.vault.azure.net`;

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = "6d02128a-1f5c-450c-8861-54d0aee8a155";
// For a cross-tenant app, TENANT_ID should be set to "common"
// Otherwise, set it to the tenant of the resources we want to access
const TENANT_ID = "a532ad36-e689-4ccb-9bee-0cfda87778e2";
// const TENANT_ID = "common";
const AUTHORITY = `https://login.microsoft.com/${TENANT_ID}/`;

// Set the redirect URI to the chromiumapp.com provided by firefox
console.log(`[auth.js] Extension extension redirect URI set to ${REDIRECT_URL}`);

// See this article for more on the authentication issues.
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

console.log("[auth.js] Creating MSAL Public Client Application Configuration object");
const msalInstance = new msal.PublicClientApplication(msalConfig);
console.log("[auth.js] Creating Interactive Browser Credential object");

// TODO: This has a sample for code using BrowserCredential to authenticate.
//       Right now it doesn't work because the auth scopes are not set properly when the KV client
//       Calls into the BrowserCredential
//       https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#implementing-the-tokencredential-interface
//       or this: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-with-the-azuremsal-browser-public-client

// const { BrowserCredential } = require("./BrowserCredential");
// const { SecretClient } = require("@azure/keyvault-secrets");

// async function get_kv_client(msalInstance) {
//   console.log("[auth.js] Creating browser credential");
//   const browserCredential = new BrowserCredential(msalInstance);
//   console.log("[auth.js] Preparing browser credential");
//   await browserCredential.prepare();
//   if (!browserCredential.isAuthenticated()) {
//     console.log("[auth.js] Browser credential is unauthenticated. Logging");
//     await browserCredential.loginRedirect(KEYVAULT_URL);
//     console.log("[auth.js] LOGGED IN!!!");
//   }
//   console.log("[auth.js] Creating secret client");
//   const client = new SecretClient(KEYVAULT_URL, browserCredential);
//   return client;
// }

// async function getSecret(msalInstance, secretName) {
//   console.log("[auth.js] Logging in...");
//   try {
//     const kv_client = await get_kv_client(msalInstance);
//     console.log(`[auth.js] Fetching secret '${secretName}' with keyvault client`);
//     var latestSecret = await kv_client.getSecret(secretName);
//     console.log(`[auth.js] Latest version of the secret ${secretName}: `, latestSecret);
//     console.log("[auth.js] Logged in successfully");
//   }
//   catch (error) {
//     console.error(`[auth.js] Unable to log in because ${error}`);
//   }
// }

async function getSecret(msalInstance, secretName) {
  console.log("[auth.js] Logging in...");
  try {
    var request = {
      scopes: ["https://vault.azure.net/.default"]
    };
    console.log(`[auth.js] Acquiring token with request ${JSON.stringify(request)}`);
    const token = await acquireToken(msalInstance, request);
    console.log(`[auth.js] Fetching secret '${secretName}' from keyvault ${KEYVAULT_NAME}.`);
    var bearer = "Bearer " + token.accessToken;
    // https://docs.microsoft.com/en-us/rest/api/keyvault/secrets/get-secret/get-secret
    // GET {vaultBaseUrl}/secrets/{secret-name}/{secret-version}?api-version=7.3
    var getSecretEndpoint = `${KEYVAULT_URL}/secrets/${secretName}?api-version=7.3`;
    var response = await axios.get(getSecretEndpoint, { headers: { "Authorization": bearer } });

    if (response.status >= 200 && response.status < 300) {
      console.log(`[auth.js] Successfully fetched secret ${secretName} from keyvault ${KEYVAULT_NAME}.`);
      return response.data.value;
    }
    else {
      console.error(`[auth.js] Unable to fetch secret ${secretName} from keyvault ${KEYVAULT_NAME}. ` +
        `Response code: ${response.status} and response body: ${response.data}`);
    }
  }
  catch (error) {
    console.error(`[auth.js] Unable to log in because ${error}`);
  }
}

var authPort;

// Add a listener for the function run when the content script
// wants to connect to the function
console.log(`[auth.js] Adding listener for incoming connections.`);
browser.runtime.onConnect.addListener(connected);

// Function to handle to auth requests
async function handleAuthMessage(message) {
  console.log("[auth.js] [authBackend.js] Received message");

  // In order to send a message back on the port:
  // authPort.postMessage({ greeting: "hello from content script" });

  if (message.action != undefined) {
    var action = message.action;

    console.log(`[auth.js] Action: ${action}`)
    switch (action) {
      case "login":
        console.log(`[auth.js] Received login command.`)
        await login(msalInstance);
        const keyvaultSecret = getSecret(msalInstance, "testSecret");
        break;
      case "logout":
        await logout(msalInstance);
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
