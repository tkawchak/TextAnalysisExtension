// const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const utilities = require('./utilities.js');
const client = require('./client.js');

const GPT_MODEL = "text-davinci-003";

// TODO: How to get the API Key? Can we put it in keyvault like the function codes?
const OPEN_AI_API_KEY = "";

const OPEN_AI_BASE_URL = "https://api.openai.com";

module.exports = {
    explainText: explainText,
};

/**
 * get data for the current webpage
 */
async function explainText() {
    var selectedObject = window.getSelection();
    var text = selectedObject.toString();
    console.log(`[openAIClient.js] Selected text: ${text}`);

    const configuration = new Configuration({
        apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // for more options on this API call,
    // See: https://platform.openai.com/docs/api-reference/completions/create#completions/create-model
    const response = await openai.createCompletion({
        model: GPT_MODEL,
        prompt: `Please explain the following text: ${text}`,
        max_tokens: 512,
        temperature: 0.7,
        // n: 1,
    });
    console.log(`Reponse: ${response}`);
    if (response.status >= 200 && response.status < 300) {
        console.log("[openAIClient.js] Received explanation for text.");
    }
    else {
        var errorMessage = `[openAIClient.js] Unable to explain text. open AI response status: ${response.status} and response body: ${response.data}`;
        console.error(errorMessage);
        throw errorMessage;
    }

    var response_text = response.data.choices[0].text;
    console.log(`[openAIClient.js] Text explanation: ${response_text}`);

    return response_text;
}