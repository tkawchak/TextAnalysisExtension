// Load the request library for making http requests
const request = require('request');
const axios = require('axios');
// TODO: Implement the configuration
var config = require('./config/development.config.json');

// Port to hold the connection to the content script
var getDocumentTextPort;

// Check to see if the connection has been set up and if so then
// send a message to request the site data.
function sendAnalyzeCommand() {
  if (getDocumentTextPort != undefined) {
    getDocumentTextPort.postMessage({ command: "analyze" });
    console.log("Sent Analyze command to content script.");
  }
  else {
    console.log("The content script port has not been initialized yet.");
  }
}

// Function to get web page data form a url.
// Calls and api that parses the webpage text and then runs readability metrics on them.
async function getWebpageData(url) {
  console.log(`Retrieving webpage data for ${url}`);
  var code = `s23M3iar2EJ9iyXfPVeHWQtCRD6BO0cTI87YtvDhnAkVawaoVTCpAw==`;
  var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?url=${url}&code=${code}`;
  var webpageData = {};
  try {
    console.log(requestUrl);
    const webpageDataResponse = await axios.get(requestUrl);
    if (webpageDataResponse.status == 200) {
      webpageData = webpageDataResponse.data;
    }
  } catch (error) {
    console.log(error);
  }

  console.log("Finished processing web page text.");
  return webpageData;
}

// Send a request to the azure function with the properly formatted data.
// the data is then stored in the cosmos DB attached to it
async function sendRequestToAzureFunction(data) {
  var requestUrl = `https://tkawchak-textanalysis.azurewebsites.net/api/HttpTrigger1`;
  var code = "HZcgMXeKKoZ92cnvsqAFMDKBVnP4cDBZ5mEcwKsgOGWfFEpsiQmGUg==";

  var response;
  // TODO: Clean up which data gets sent to azure function
  try {
    response = await axios.get(requestUrl, {
      params: {
        code: code,
        name: data.title,
        url: data.url,
        grade: data.fleschkincaid_grade,
        score: data.flesch_ease,
        author: data.author,
        text: data.content,
        date_published: data.date_published,
        domain: data.domain,
        excerpt: data.excerpt,
        lead_image_url: data.lead_image_url,
        syllable_count: data.syllable_count,
        word_count: data.lexicon_count,
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
      }
    });
  } catch (error) {
    console.log(error);
  }

  return response;
}

// Function to handle to response messages from the content script
async function handleMessage(message) {
  console.log("In background script, received message from content script: ");
  // Uncomment this line to help with debugging.
  // The log messages in the background script will only be visible this way.
  // alert("In background script, received message from content script.");
  if (getDocumentTextPort != undefined) {
    getDocumentTextPort.postMessage({ status: "Received message from content script"});
  }

  // get the data from the given url
  // need to do this in JS if the extension will be able to give feedback to the user
  if (message.data != undefined) {
    url = message.data;
    console.log(`url to analyze: ${url}`);
    try {
      webpageTextData = await getWebpageData(url);
    } catch (error) {
      console.log(error);
    }
    console.log(webpageTextData);

    // Send the data in a request to be processed and stored by the azure function
    var response = await sendRequestToAzureFunction(webpageTextData);
    if (response.status == 200) {
      getDocumentTextPort.postMessage({status: `Successfully sent data to azure function with response ${response.data}.`});
    }
    else {
      getDocumentTextPort.postMessage({status: `Failed to send data to azure function successfully.`});
    }
  }
}

// Listener for the extension button clicked
browser.browserAction.onClicked.addListener(sendAnalyzeCommand);

// Function to execute when the background script receives an event to connect
// to the main content script
function connected(port) {
  getDocumentTextPort = port;
  getDocumentTextPort.onMessage.addListener(handleMessage);
}

// Add a listener for the function run when the content script
// wants to connect to the function
browser.runtime.onConnect.addListener(connected);