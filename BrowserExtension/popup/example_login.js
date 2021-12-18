const msal = require("@azure/msal-browser");

module.exports = {
    login: login,
    logout: logout
};

const AUTHORITY = 'https://login.microsoftonline.com/common/';
const REDIRECT_URL = "https://760811abd6a6a30cf175b12cb1d55b79c44dbc15.extensions.allizom.org/";
const CLIENT_ID = "6d02128a-1f5c-450c-8861-54d0aee8a155";

// Set the redirect URI to the chromiumapp.com provided by firefox
console.log(`Extension extension redirect URI set to ${REDIRECT_URL}`);

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

// Set currently logged in account
const accounts = msalInstance.getAllAccounts();
if (accounts.length) {
    console.log(`accounts is not empty. First value: ${accounts[0].username}`);
}
else {
    console.log(`accounts is empty`);
}

/**
 * Generates a login url
 */
 async function getLoginUrl(request) {
    console.log(`get login url`);
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
async function getAcquireTokenUrl(request) {
    console.log(`get acquire token url`);
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
async function launchWebAuthFlow(url) {
    console.log(`launch web auth flow with url: ${url}`);
    return new Promise((resolve, reject) => {
        browser.identity.launchWebAuthFlow({
            interactive: true,
            url
        }, (responseUrl) => {
            // Response urls includes a hash (login, acquire token calls)
            console.log(`launch web auth flow responseUrl: ${responseUrl}`);
            if (responseUrl.includes("#")) {
                msalInstance.handleRedirectPromise(`#${responseUrl.split("#")[1]}`)
                    .then(resolve)
                    .catch(reject)
            } else {
                // Logout calls
                resolve();
            }
        })
    })
}

/**
 * Generates a logout url
 */
async function getLogoutUrl(request) {
    console.log(`get logout url`);
    return new Promise((resolve, reject) => {
        msalInstance.logout({
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
async function acquireToken(request) {
    console.log(`acquire token`);
    return msalInstance.acquireTokenSilent(request)
        .catch(async (error) => {
            console.error(error);
            const acquireTokenUrl = await getAcquireTokenUrl(request);

            return launchWebAuthFlow(acquireTokenUrl);
        })
}

// Login
async function login() {
    // These actions would be performed when a user clicks a "Login" button
    console.log(`getting login url`);
    const loginUrl = await getLoginUrl();
    console.log(`launch web auth flow for login`);
    const loginResult = await launchWebAuthFlow(loginUrl);
    console.log(`login result - ${loginResult.account.username}`);
}

// Acquire token
// const { accessToken } = await acquireToken({
//     scopes: [ "user.read" ],
//     account: msalInstance.getAllAccounts()[0]
// });

// Logout
async function logout() {
    console.log(`getting logout url`);
    const logoutUrl = await getLogoutUrl();
    console.log(`launching web auth flow for logout`);
    await launchWebAuthFlow(logoutUrl);
    console.log(`logged out`);
}
