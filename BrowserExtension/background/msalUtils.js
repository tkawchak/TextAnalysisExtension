module.exports = {
  login: login,
  logout: logout,
  acquireToken: acquireToken,
};

// See this for some more info on where these functions came from
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-browser-samples/ChromiumExtensionSample/auth.js

/**
 * Generates a login url
 */
async function getLoginUrl(msalInstance, request) {
  console.log(`[msalUtils.js] get login url`);
  return new Promise((resolve, reject) => {
    msalInstance.loginRedirect({
      ...request,
      onRedirectNavigate: (url) => {
        resolve(url);
        return false;
      }
    }).catch(reject);
  });
}


/**
 * Generates an acquire token url
 */
async function getAcquireTokenUrl(msalInstance, request) {
  console.log(`[msalUtils.js] get acquire token redirect url for request ${JSON.stringify(request)}`);
  return new Promise((resolve, reject) => {
    msalInstance.acquireTokenRedirect({
      ...request,
      onRedirectNavigate: (url) => {
        console.log(`[msalUtils.js] OnRedirect - Resolve with url ${url}`);
        resolve(url);
        return false;
      }
    }).catch(reject);
  });
}

/**
 * Generates a login url
 */
async function launchWebAuthFlow(msalInstance, url) {
  console.log(`[msalUtils.js] launch web auth flow with url: ${url}`);
  return new Promise((resolve, reject) => {
    browser.identity.launchWebAuthFlow({
      interactive: true,
      url
    }, (responseUrl) => {
      // Response urls includes a hash (login, acquire token calls)
      console.log(`[msalUtils.js] launch web auth flow responseUrl: ${responseUrl}`);
      if (responseUrl.includes("#")) {
        const responseUrlPart = `#${responseUrl.split("#")[1]}`;
        console.log(`[msalUtils.js] Performing a login`);
        msalInstance.handleRedirectPromise(responseUrlPart)
          .then(resolve)
          .catch(reject)
      } else {
        console.log(`[msalUtils.js] Performing a logout`);
        // Logout calls
        resolve();
      }
    })
  })
}

/**
 * Generates a logout url
 */
async function getLogoutUrl(msalInstance, request) {
  console.log(`[msalUtils.js] get logout url`);
  return new Promise((resolve, reject) => {
    // msalInstance.logout({
    msalInstance.logoutRedirect({
      ...request,
      onRedirectNavigate: (url) => {
        resolve(url);
        return false;
      }
    }).catch(reject);
  });
}

/**
 * Attempts to silent acquire an access token, falling back to interactive.
 */
async function acquireToken(msalInstance, request) {
  console.log(`[msalUtils.js] acquiring token with request ${JSON.stringify(request)}`);
  return msalInstance.acquireTokenSilent(request)
    .catch(async (error) => {
      console.log(`[msaulUtils.js] Falling back to interactive token acquisition due to: ${error}`);
      console.log(`[msalUtils.js] Getting acquire token URL for request ${JSON.stringify(request)}`);
      const acquireTokenUrl = await getAcquireTokenUrl(msalInstance, request);
      console.log(`[msalUtils.js] Acquire token URL: ${acquireTokenUrl}`);

      return launchWebAuthFlow(msalInstance, acquireTokenUrl);
    });
}

// Login
async function login(msalInstance) {
  // These actions would be performed when a user clicks a "Login" button
  console.log(`[msalUtils.js] getting login url`);
  const loginUrl = await getLoginUrl(msalInstance);
  console.log(`[msalUtils.js] launch web auth flow for login`);
  const loginResult = await launchWebAuthFlow(msalInstance, loginUrl);
  console.log(`[msalUtils.js] login result username - ${loginResult.account.username}`);
  return loginResult;
}

// Logout
async function logout(msalInstance) {
  console.log(`[msalUtils.js] getting logout url`);
  const logoutUrl = await getLogoutUrl(msalInstance);
  console.log(`[msalUtils.js] launching web auth flow for logout`);
  await launchWebAuthFlow(msalInstance, logoutUrl);
  console.log(`[msalUtils.js] logged out`);
}
