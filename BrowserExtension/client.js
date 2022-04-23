const axios = require('axios');
const utilities = require('./utilities.js');

const badTitleCharactersRegex = new RegExp("[#]", "g");

module.exports = {
    extractWebpageInfo: extractWebpageInfo,
    getCurrentWebpageData: getCurrentWebpageData,
    processWebpage: processWebpage,
    processWebpageData: processWebpageData,
    fetchWebpageData: fetchCurrentWebpageData,
    analyzeText: analyzeText,
    computeReadability: computeReadability,
    analyzeSelectedText: analyzeSelectedText,
    analyzeCustomText: analyzeCustomText,
};

/**
 * get data for the current webpage
 */
async function getCurrentWebpageData(functionCodes) {
    var url = utilities.getWebpageUrl();
    console.log(`[client.js] Fetching webpage data from URL ${url}`);
    var webpageData = await extractWebpageInfo(url, functionCodes);
    var webpageReadabilityMetrics = await computeReadability(webpageData.content, functionCodes);

    // TODO: Create some contracts so that we don't have to specify all of these here.
    var result = {
        author: webpageData.author,
        content: webpageData.content,
        date_published: webpageData.date_published,
        dek: webpageData.dek,
        direction: webpageData.direction,
        domain: webpageData.domain,
        excerpt: webpageData.excerpt,
        lead_image_url: webpageData.lead_image_url,
        next_page_url: webpageData.next_page_url,
        rendered_pages: webpageData.rendered_pages,
        title: webpageData.title,
        total_pages: webpageData.total_pages,
        url: webpageData.url,
        word_count: webpageData.word_count,
        syllable_count: webpageReadabilityMetrics.syllable_count,
        lexicon_count: webpageReadabilityMetrics.lexicon_count,
        sentence_count: webpageReadabilityMetrics.sentence_count,
        average_sentence_length: webpageReadabilityMetrics.average_sentence_length,
        lix_readability_index: webpageReadabilityMetrics.lix_readability_index,
        flesch_ease: webpageReadabilityMetrics.flesch_ease,
        fleschkincaid_grade: webpageReadabilityMetrics.fleschkincaid_grade,
        coleman_liau_index: webpageReadabilityMetrics.coleman_liau_index,
        automated_readability_index: webpageReadabilityMetrics.automated_readability_index,
        dale_chall_readability_score: webpageReadabilityMetrics.dale_chall_readability_score,
        difficult_words: webpageReadabilityMetrics.difficult_words,
        linsear_write_index: webpageReadabilityMetrics.linsear_write_index,
        gunning_fog_index: webpageReadabilityMetrics.gunning_fog_index,
        smog_index: webpageReadabilityMetrics.smog_index,
        overall_score: webpageReadabilityMetrics.overall_score,
    };
    return result;
}

/**
 * Analyze some text
 * @param {string} text 
 */
async function analyzeText(text, functionCodes) {
    console.log(`[client.js] Extracting Text data for custom text`);
    var code = functionCodes['ExtractTextFuncCode'];
    var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?code=${code}`;
    // var requestUrl = `http://localhost:7072/api/ExtractText?url=${url}&code=${code}`;

    var webpageData = {};
    var response = await axios.post(requestUrl, {
        content: text,
    });
    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] processing custom text successfully");
        webpageData = response.data;
    }
    else {
        var errorMessage = `[client.js] Unable to analyze text. ExtractText response status: ${response.status} and response body: ${response.data}`;
        console.error(errorMessage);
        throw errorMessage;
    }

    return webpageData;
}

/**
 * compute the readability metrics of some text.
 * @param {string} content 
 */
async function computeReadability(content, functionCodes) {
    console.log(`[client.js] computing readability metrics`);
    var code = functionCodes['ComputeReadabilityFuncCode'];
    var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ComputeReadability?code=${code}`;
    // var requestUrl = `http://localhost:7072/api/ComputeReadability?code=${code}`;

    console.log(`[client.js] Sending request to ${requestUrl}`);

    var readabilityData = {};
    var response = await axios.post(requestUrl, {
        content: content,
    });

    console.log(`[client.js] Received response`);

    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] Successfully computed readability");
        readabilityData = response.data;
    }
    else {
        var errorMessage = `[client.js] Unable to extract readability. Response status: ${response.status} and response body: ${response.data}`;
        console.error(errorMessage);
        throw errorMessage;
    }

    return readabilityData;
}

/**
 * Function to get web page data form a url.
 * Calls and api that parses the webpage text and then runs readability metrics on them.
 * @param {*} url The url to get webpage data from
 */
async function extractWebpageInfo(url, functionCodes) {
    console.log(`[client.js] Retrieving webpage data for ${url}`);
    var code = functionCodes['ExtractTextFuncCode'];
    var requestUrl = `https://textextractionfunc.azurewebsites.net/api/ExtractText?code=${code}`;
    // var requestUrl = `http://localhost:7072/api/ExtractText?code=${code}`;

    var webpageData = {};
    console.log(`[client.js] Request url: ${requestUrl}`);
    var response = await axios.post(requestUrl, {
        url: url,
    });
    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] processed web page text successfully");
        webpageData = response.data;
    }
    else {
        var errorMessage = `[client.js] Unable to extract text from webpage. ExtractText response status: ${response.status} and response body: ${response.data}`;
        console.error(errorMessage);
        throw errorMessage;
    }

    return webpageData;
}

/**
 * Send a webpage url to the request service for it to analyze
 * If that is successful, then it will fetch the data and display it.
 */
async function processWebpage(functionCodes) {
    console.log(`[client.js] processing web page data`);
    var webpageData = await getCurrentWebpageData(functionCodes);
    console.log(`[client.js] sending data to ProcessTextFunc for processing`);
    webpageAnalysisResult = await processWebpageData(webpageData, functionCodes);
    console.log(`[client.js] webpage processing result: ${JSON.stringify(webpageAnalysisResult)}`);
    var webpageData = await fetchCurrentWebpageData(functionCodes);
    return webpageData;
}

/**
 * Send a request to the azure function with the properly formatted data.
 * the data is then stored in the cosmos DB attached to it
 * 
 * @param {*} data The data from the webpage
 */
async function processWebpageData(data, functionCodes) {
    // TODO: How to pass the code value as part of a header?
    var code = functionCodes['ProcessTextHttpFuncCode'];
    var requestUrl = `https://processtext.azurewebsites.net/api/ProcessTextHttp?code=${code}`;
    // var requestUrl = `http://localhost:7071/api/ProcessTextHttp?code=${code}`;
    var response;

    var title = data.title.replace(badTitleCharactersRegex, "");
    var domain = data.domain;
    console.log(`[client.js] Sending request to process webpage with domain '${domain}' and title '${title}'`);

    // TODO: Create some contracts so we don't have to specify these values here.
    response = await axios.post(requestUrl, {
        author: data.author,
        content: data.content,
        date_published: data.date_published,
        domain: domain,
        excerpt: data.excerpt,
        lead_image_url: data.lead_image_url,
        title: title,
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

    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] Successfully processed webpage data.");
        return response.data;
    }
    else {
        console.error(`[client.js] Unable to extract data from webpage. ProcessTextHttp Response Code: ${response.status} and response body: ${response.data}`);
        throw `Unable to process webpage data. Response status: ${response.status} and message: ${response.data}`;
    }
}

/**
 * Fetch the data for the current webpage
 */
async function fetchCurrentWebpageData(functionCodes) {
    var webpageData = await getCurrentWebpageData(functionCodes);

    console.log(`[client.js] fetching data for webpage ${webpageData.url}`);
    var code = functionCodes['GetProcessedTextFuncCode'];
    var title = webpageData.title.replace(badTitleCharactersRegex, "");
    var domain = webpageData.domain;
    console.log(`[client.js] Fetching data with Domain: ${domain}, Title: ${title}`);
    var requestUrl = `https://processtext.azurewebsites.net/api/GetProcessedText?id=${title}&domain=${domain}&code=${code}`;
    // var requestUrl = `http://localhost:7071/api/GetProcessedText?id=${title}&domain=${domain}&code=${code}`;
    var response;
    response = await axios.get(requestUrl);

    if (response.status >= 200 && response.status < 300) {
        console.log("[client.js] Successfully fetched data for webpage.");
        return response.data;
    }
    else {
        console.log(`[client.js] Unable to fetch data from webpage. GetProcessedText response code: ${response.status} and response body: ${response.data}`);
        throw `Unable to fetch data from webpage. GetProcessedText response code: ${response.status} and response body: ${response.data}`;
    }
}

/**
 * Analyze the selected text on a current webpage
 */
async function analyzeSelectedText(functionCodes) {
    var selectedObject = window.getSelection();
    var text = selectedObject.toString();
    console.log(`[client.js] Selected text: ${text}`);
    return await sanitizeAndComputeReadability(text, functionCodes);
}

/**
 * Analyze the custom text
 */
async function analyzeCustomText(text, functionCodes) {
    console.log(`[client.js] Custom text: ${text}`);
    return await sanitizeAndComputeReadability(text, functionCodes);
}

async function sanitizeAndComputeReadability(text, functionCodes) {
    console.log(`[client.js] Computing readability for text ${text}`);
    var result = {};

    if (text == null || text.trim() == "") return result;

    try {
        // TODO: Sanitize this input
        result = await computeReadability(text, functionCodes);
    }
    catch (error) {
        console.error(`[menu_actions.js] Unable to compute readability because ${error}`);
    }
    
    return result;
}
