// const msal = require("@azure/msal-browser");

// const AUTHORITY = 'https://login.microsoftonline.com/common/';
// const REDIRECT_URL = browser.identity.getRedirectURL();
// const CLIENT_ID = "6d02128a-1f5c-450c-8861-54d0aee8a155";

// const msalConfig = {
//     auth: {
//         clientId: CLIENT_ID,
//         authority: AUTHORITY,
//         redirectUri: REDIRECT_URL
//     }
// };

// // package docs: https://www.npmjs.com/package/@azure/msal-browser
// // github docs: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
// const msalInstance = new msal.PublicClientApplication(msalConfig);
// msalInstance.handleRedirectPromise().then((tokenResponse) => {
//   // Check if the tokenResponse is null
//   // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
//   if (tokenResponse !== null) {
//     console.log("Success!");
//   }
//   // If the tokenResponse === null, you are not coming back from an auth redirect.
//   else if (tokenResponse === null) {
//     console.log("Not an auth redirect");
//   }
//   else {
//     console.log("Something else??");
//   }
// }).catch((error) => {
//   console.error("Error during authenticaiton");
//   console.error(error);
//   // handle error, either in the library or coming back from the server
// });

// // Acquire tokens: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md
// var request = {
//   scopes: ["User.Read"]
// };

// msalInstance.loginPopup({
//   redirectUri: REDIRECT_URL,
// });
// msalInstance.acquireTokenSilent(request).then(tokenResponse => {
//   // Do something with the tokenResponse
//   console.log("Successful token response");
//   console.log(`${tokenReponse}`);
// }).catch(error => {
//   if (error instanceof msal.InteractionRequiredAuthError) {
//       // fallback to interaction when silent call fails
//       console.log("Interaction required. Obtaining access token by redirecting browser window..");
//       return msalInstance.acquireTokenPopup(request);
//   }
//   else {
//     console.log(`Something else happened: ${error}`);
//   }
// }).catch(error => {
//   console.error(error);
// });

// Can also use loginRedirect and acquireTokenRedirect instead
// of loginPopup and acquireTokenPopup


// See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity/getRedirectURL for more
console.log(`Getting browser redirect URL`);
try {
  var redirectURL = browser.identity.getRedirectURL();
  console.log(`Redirect URL: ${redirectURL}`);
}
catch (error) {
  console.error(`Unable to get redirect url because ${error}`);
}
