const axios = require('axios');
const utilities = require('./utilities.js');

module.exports = {
    getWebpageData: getWebpageData,
    getCurrentWebpageData: getCurrentWebpageData,
    processWebpage: processWebpage,
    processWebpageData: processWebpageData,
    fetchWebpageData: fetchWebpageData,
};

async function getCurrentWebpageData() {
    var url = utilities.getWebpageUrl();
    console.log(`[client.js] Fetching webpage data from URL ${url}`);
    webpageData = await getWebpageData(url);
    return webpageData;
}

/**
 * Function to get web page data form a url.
 * Calls and api that parses the webpage text and then runs readability metrics on them.
 * 
 * @param {*} url The url to get webpage data from
 */
async function getWebpageData(url) {
    console.log(`[client.js] Retrieving webpage data for ${url}`);
    var code = `s23M3iar2EJ9iyXfPVeHWQtCRD6BO0cTI87YtvDhnAkVawaoVTCpAw==`;
    // var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?url=${url}&code=${code}`;
    var requestUrl = `http://localhost:7072/api/ExtractText?url=${url}&code=${code}`;
    var webpageData = {};
    try {
        console.log("[client.js] sending request to get webpage data");
        var response = await axios.get(requestUrl);
        if (response.status >= 200 && response.status < 300) {
            console.log("[client.js] processed web page text successfully");
            webpageData = response.data;
        }
        else {
            console.log(`[client.js] Unable to process webpage data.  ExtractText Status Code: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }

    return webpageData;
}

/**
 * Send a webpage url to the request service for it to analyze
 * If that is successful, then it will fetch the data and display it.
 * 
 * throws an exception if there is a bad response code
 */
async function processWebpage() {
    console.log(`[client.js] processing web page data`);
    var webpageData = await getCurrentWebpageData();
    console.log(`[client.js] sending data to ProcessTextFunc for processing`);
    webpageAnalysisResult = await processWebpageData(webpageData);
    console.log(`[client.js] webpage processing result: ${JSON.stringify(webpageAnalysisResult)}`);
    var webpageData = await fetchWebpageData();
    return webpageData;
  }

/**
 * Send a request to the azure function with the properly formatted data.
 * the data is then stored in the cosmos DB attached to it
 * @param {*} data The data from the webpage
 */
async function processWebpageData(data) {
    // TODO: How to pass the code value as part of a header?
    var code = `2ufJzrhP9OYCE6gl/afIMsIVyOm/azxo0Z5ChDQzxLXmY0GAaFP0xg==`;
    // var requestUrl = `https://processtext.azurewebsites.net/api/ProcessTextHttp?code=${code}`;
    var requestUrl = `http://localhost:7071/api/ProcessTextHttp?code=${code}`;
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

    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] Successfully extracted data from webpage.");
        return response.data;
    }
    else {
        console.warn(`[client.js] Unable to extract data from webpage. ProcessTextHttp Response Code: ${response.status} and response body: ${response.data}`);
        throw `Unable to process webpage data. Response status: ${response.status} and message: ${response.data}`
    }
}

/**
 * Fetch the data for a webpage
 */
async function fetchWebpageData() {
    var webpageData = await getCurrentWebpageData();

    console.log(`[client.js] fetching data for webpage ${webpageData.url}`);
    var code = "Ds7yQ3yWjKLFc1bkg9B4FO4UOx5Coa4Dzy7tCt8I3NbrItaOeQYbfA==";
    var title = webpageData.title;
    var domain = webpageData.domain;
    // var requestUrl = `https://processtext.azurewebsites.net/api/GetProcessedText?d=${title}&domain=${domain}&code=${code}`;
    var requestUrl = `http://localhost:7071/api/GetProcessedText?id=${title}&domain=${domain}&code=${code}`;
    var response;
    try {
        response = await axios.get(requestUrl);
        console.log(`Response code: ${response.status}`);
        console.log(`Response body: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(error);
    }

    if (response.status == 200) {
        console.log("[client.js] Successfully fetched data from webpage.");
        return response.data;
    }
    else {
        console.log(`[client.js] Unable to fetch data from webpage. GetProcessedText Response Code: ${response.status}`);
        return {};
    }
}