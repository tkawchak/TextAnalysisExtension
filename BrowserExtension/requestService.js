// Load the logger to application insights
// var logger = require("./telemetry/logging.js");
// const logger = logs.logger;
// import logger from "./telemetry/application-insights.js"

const axios = require('axios');

/**
 * Function to get web page data form a url.
 * Calls and api that parses the webpage text and then runs readability metrics on them.
 * 
 * @param {*} url The url to get webpage data from
 */
async function getWebpageData(url) {
  console.log(`In background script, Retrieving webpage data for ${url}`);
  var code = `s23M3iar2EJ9iyXfPVeHWQtCRD6BO0cTI87YtvDhnAkVawaoVTCpAw==`;
  var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?url=${url}&code=${code}`;
  // var requestUrl = `http://localhost:7072/api/ExtractText?url=${url}&code=${code}`;
  var webpageData = {};
  try {
    console.log("In background script, sending request to get webpage data");
    const webpageDataResponse = await axios.get(requestUrl);
    if (webpageDataResponse.status == 200) {
      console.log("In background script, processed web page text successfully");
      webpageData = webpageDataResponse.data;
    }
    else {
      console.log(`In background script, Unable to process webpage data.  ExtractText Status Code: ${webpageDataResponse.status}`);
    }
  } catch (error) {
    console.error(error);
  }

  return webpageData;
}

/**
 * Send a request to the azure function with the properly formatted data.
 * the data is then stored in the cosmos DB attached to it
 * @param {*} data The data from the webpage
 */
async function processTextData(data) {
  // TODO: How to pass the code value as part of a header?
  var requestUrl = `https://processtext.azurewebsites.net/api/ProcessTextHttp?code=2ufJzrhP9OYCE6gl/afIMsIVyOm/azxo0Z5ChDQzxLXmY0GAaFP0xg==`;
  // var requestUrl = `http://localhost:7071/api/ProcessTextHttp?code=2ufJzrhP9OYCE6gl/afIMsIVyOm/azxo0Z5ChDQzxLXmY0GAaFP0xg==`;
  var response;
  // TODO: Clean up which data gets sent to azure function??
  try {
    response = await axios.post(requestUrl, {
      author: data.author,
      content: data.content,
      date_published: data.date_published,
      domain: data.domain,
      excerpt: data.excerpt,
      lead_image_url: data.lead_image_url,
      title: data.title,
      url: data.url,
      syllable_count: data.syllable_count,
      lexicon_count: data.lexicon_count,
      sentence_count: data.sentence_count,
      average_sentence_length: data.average_sentence_length,
      lix_readability_index: data.lix_readability_index,
      flesch_ease: data.flesch_ease,
      fleschkincaid_grade: data.fleschkincaid_grade,
      coleman_liau_index: data.coleman_liau_index,
      automated_readability_index: data.automated_readability_index,
      dale_chall_readability_score: data.dale_chall_readability_score,
      difficult_words: data.difficult_words,
      linsear_write_index: data.linsear_write_index,
      gunning_fog_index: data.gunning_fog_index,
      smog_index: data.smog_index,
      overall_score: data.overall_score
    });
  } catch (error) {
    console.error(error);
  }

  if (response.status == 200) {
    console.log("In background script, Successfully extracted data from webpage.");
  }
  else {
    console.log(`In background script, Unable to extract data from webpage.  ProcessTextHttp Response Code: ${response.status}`);
  }

  return response;
}

/** Function to handle to response messages from the content script
 * param {*} message
 */ 
async function handleMessage(message) {
  console.log(`In background script, Received message from content script: ${JSON.stringify(message)}`);

  // get the data from the given url
  // need to do this in JS if the extension will be able to give feedback to the user
  if (message.data != undefined) {
    url = message.data;
    console.log(`In background script, url to analyze: ${url}`);
    try {
      webpageTextData = await getWebpageData(url);
    } catch (error) {
      console.log(error);
    }

    // Send the data in a request to be processed and stored
    var response = await processTextData(webpageTextData);
    if (response.status == 200) {
      console.log(`In background script, Successfully processed text data ${response.data}.`);
    }
    else {
      console.log(`In background script, Failed to process text data successfully. Status code: ${response.status}. Response: ${response.data}`);
    }
  }
}

/** Function to execute when the background script receives an event to connect
 * to the main content script
 */
function connected(port) {
  getDocumentTextPort = port;
  getDocumentTextPort.onMessage.addListener(handleMessage);
}

// Port to hold the connection to the content script
var getDocumentTextPort;

// Add a listener for the function run when the content script
// wants to connect to the function
browser.runtime.onConnect.addListener(connected);
