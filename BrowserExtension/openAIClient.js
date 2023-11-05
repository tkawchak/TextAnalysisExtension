// const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const utilities = require("./utilities.js");
const client = require("./client.js");

const GPT_MODEL = "text-davinci-003";
const GPT_CHAT_MODEL = "gpt-4";
const OPEN_AI_API_KEY = "OpenAIAPIKey";
const OPEN_AI_BASE_URL = "https://api.openai.com";

module.exports = {
  explainText: explainText,
  summarizeText: summarizeText,
};

async function summarizeText(text, functionCodes) {
  if (text == null || text.trim() == "") {
    console.log(`[openAIClient.js] No text specified`);
    throw "No text specified";
  } else {
    text = text.trim();
  }

  const configuration = new Configuration({
    apiKey: functionCodes[OPEN_AI_API_KEY],
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: GPT_CHAT_MODEL,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Please summarize the following article in 250 words or less: ${text}`,
      },
    ],
  });

  var summary = response.data.choices[0].message.content;
  console.log(`Response: ${summary}`);

  return summary;
}

/**
 * get data for the current webpage
 * @param {*} functionCodes The authentication codes needed for authenticating to OpenAI
 }
 */
async function explainText(functionCodes) {
  var selectedObject = window.getSelection();
  var text = selectedObject.toString();
  if (text == null || text.trim() == "") {
    console.log(`[openAIClient.js] No Text selected`);
    throw "No text selected";
  } else {
    text = text.trim();
    console.log(`[openAIClient.js] Selected text: ${text}`);
  }

  const configuration = new Configuration({
    apiKey: functionCodes[OPEN_AI_API_KEY],
  });
  const openai = new OpenAIApi(configuration);

  // For more options on this API call,
  // see: https://platform.openai.com/docs/api-reference/completions/create#completions/create-model
  const response = await openai.createCompletion({
    model: GPT_MODEL,
    prompt: `Please explain the following text: ${text}`,
    max_tokens: 512,
    temperature: 0.7,
    // n: 1,
  });
  console.log(`Response: ${response}`);
  if (response.status >= 200 && response.status < 300) {
    console.log("[openAIClient.js] Received explanation for text.");
  } else {
    var errorMessage = `Unable to explain text. OpenAI response status: ${response.status} and response body: ${response.data}`;
    console.error(`[openAIClient.js] ${errorMessage}`);
    throw errorMessage;
  }

  var response_text = response.data.choices[0].text;
  console.log(`[openAIClient.js] Text explanation: ${response_text}`);

  return response_text;
}
