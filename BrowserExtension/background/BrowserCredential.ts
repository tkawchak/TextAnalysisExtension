import { TokenCredential, AccessToken } from "@azure/core-auth";
import * as msalBrowser from "@azure/msal-browser";
import { login, acquireToken } from "./msalUtils";

// TODO: this code is taken from here: 
// https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-with-the-azuremsal-browser-public-client
class BrowserCredential implements TokenCredential {
  private publicApp: msalBrowser.PublicClientApplication;
  private hasAuthenticated: boolean = false;

  constructor(msalInstance) {
    this.publicApp = msalInstance;
  }

  // Either confirm the account already exists in memory, or tries to parse the redirect URI values.
  async prepare(): Promise<void> {
    try {
      if (await this.publicApp.getActiveAccount()) {
        console.log("[BrowserCredential.ts] App is already logged in");
        this.hasAuthenticated = true;
        return;
      }

      console.log("[BrowserCredential.ts] Handling redirect promise");
      await this.publicApp.handleRedirectPromise();
      this.hasAuthenticated = true;
    } catch (e) {
      console.error("BrowserCredential prepare() failed", e);
    }
  }

  // Should be true if prepare() was successful.
  isAuthenticated(): boolean {
    return this.hasAuthenticated;
  }

  // If called, triggers authentication via redirection.
  async loginRedirect(scopes: string | string[]): Promise<void> {
    const loginRequest = {
      scopes: Array.isArray(scopes) ? scopes : [scopes]
    };

    console.log("[BrowserCredential.ts] Logging in with redirect");
    await this.publicApp.loginRedirect(loginRequest);
  }

  // Tries to retrieve the token without triggering a redirection.
  async getToken(scopes: string | string[]): Promise<AccessToken> {
    if (!this.hasAuthenticated) {
      throw new Error("Authentication required");
    }
     
    const loginResult1 = await login(this.publicApp);
    this.publicApp.setActiveAccount(loginResult1.account);

    // We are close here!
    // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
    // https://stackoverflow.com/questions/68090013/openid-profile-offline-access-is-not-valid-error-when-calling-acquiretoken-m

    console.log(`[BrowserCredential.ts] Acquiring token for scopes ${scopes}`);
    const account = this.publicApp.getActiveAccount();
    console.log(`[BrowserCredential.ts] Active account - ${account.username} in tenant ${account.tenantId} with claims ${JSON.stringify(account.idTokenClaims)}.`);
    const accessToken = await acquireToken(
      this.publicApp,
      {
        scopes: scopes,
        account: this.publicApp.getActiveAccount(),
      },
    );

    console.log(`[BrowserCredential.ts] Received access token ${accessToken}`);

    // Temp code
    // const parameters: msalBrowser.RedirectRequest = {
      // account: await this.publicApp.getActiveAccount(),
      // scopes: Array.isArray(scopes) ? scopes : [scopes]
    // };
    // console.log("[BrowserCredential.ts] Logging in");
    // const loginResult = await this.publicApp.acquireTokenRedirect(parameters);
    // Temp code

    // ********************************
    // TODO: Can I somehow use the login function to log into a different public app with the proper
    // setup to log into keyvault?
    // ********************************

    // const loginResult = await login(this.publicApp);
    // console.log(`[BrowserCredentials.ts] account: ${parameters.account}`);
    // console.log(`[BrowserCredentials.ts] scope: ${parameters.scopes}`);
    // console.log(`[BrowserCredentials.ts] Parameters: ${parameters}`);
    // const result = await this.publicApp.acquireTokenSilent(parameters);

    // console.log(`[BrowserCredential.ts] Returning Access Token ${loginResult.idToken} which expires on ${loginResult.expiresOn.getTime()}`);
    return {
      // token: loginResult.idToken,
      token: accessToken,
      // expiresOnTimestamp: loginResult.expiresOn.getTime()
      expiresOnTimestamp: 0,
    };
  }
}

export { BrowserCredential };