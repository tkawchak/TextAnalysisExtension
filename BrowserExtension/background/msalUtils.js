module.exports = {
  login: login,
  logout: logout
};


/**
 * Generates a login url
 */
async function getLoginUrl(msalInstance, request) {
  console.log(`[auth.js] get login url`);
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
  console.log(`[auth.js] get acquire token url`);
  return new Promise((resolve, reject) => {
    msalInstance.acquireTokenRedirect({
      ...request,
      onRedirectNavigate: (url) => {
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
  console.log(`[auth.js] launch web auth flow with url: ${url}`);
  return new Promise((resolve, reject) => {
    browser.identity.launchWebAuthFlow({
      interactive: true,
      url
    }, (responseUrl) => {
      // Response urls includes a hash (login, acquire token calls)
      console.log(`[auth.js] launch web auth flow responseUrl: ${responseUrl}`);
      if (responseUrl.includes("#")) {
        console.log(`[auth.js] Performing a login: ${responseUrl}`);
        msalInstance.handleRedirectPromise(`#${responseUrl.split("#")[1]}`)
          .then(resolve)
          .catch(reject)
      } else {
        console.log(`[auth.js] Performing a logout: ${responseUrl}`);
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
  console.log(`[auth.js] get logout url`);
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
  console.log(`[auth.js] acquire token`);
  return msalInstance.acquireTokenSilent(request)
    .catch(async (error) => {
      console.error(error);
      const acquireTokenUrl = await getAcquireTokenUrl(msalInstance, request);

      return launchWebAuthFlow(acquireTokenUrl);
    })
}

// Login
async function login(msalInstance) {
  // These actions would be performed when a user clicks a "Login" button
  console.log(`[auth.js] [auth.js] getting login url`);
  const loginUrl = await getLoginUrl(msalInstance);
  console.log(`[auth.js] launch web auth flow for login`);
  const loginResult = await launchWebAuthFlow(msalInstance, loginUrl);
  console.log(`[auth.js] login result username - ${loginResult.account.username}`);
}

// Acquire token
// const { accessToken } = await acquireToken({
//     scopes: [ "user.read" ],
//     account: msalInstance.getAllAccounts()[0]
// });

// Logout
async function logout(msalInstance) {
  console.log(`[auth.js] getting logout url`);
  const logoutUrl = await getLogoutUrl(msalInstance);
  console.log(`[auth.js] launching web auth flow for logout`);
  await launchWebAuthFlow(msalInstance, logoutUrl);
  console.log(`[auth.js] logged out`);
}
