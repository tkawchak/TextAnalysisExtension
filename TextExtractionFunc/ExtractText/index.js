var Mercury = require('@postlight/mercury-parser');

/**
 * Parse api request
 * @param {*} request The request input
 * @param {*} context The request context
 */
function parseRequestInput(request, context) {
    context.log("Parsing request input");
    if (request == null || request.body == null)
    {
        return {
            status: 400,
            body: "Please add request body"
        }
    }
    context.log("Checking for valid url");
    var url = request.body["url"];
    var isUrlValid = isValidUrl(url, context);

    if (!isUrlValid) {
        return {
            status: 400,
            body: "Please enter valid url."
        }
    }

    context.log("Parsed request data successfully.");
    return {
        status: 200,
        body: "Valid Url",
        isUrlValid: isUrlValid,
        url: url,
    }
}

/**
 * Perform a check to make sure the url is valid
 * @param {string} url the url to check
 * @param {*} context for logging
 */
function isValidUrl(url, context) {
    if (url == null) {
        context.log("Url not present on request");
        return false;
    }
    if (!url.includes("://")) {
        context.log("Url does not contain '://'. INVALID.");
        return false;
    }
    if (!url.includes(".")) {
        context.log("Url does not contain '.'. INVALID.")
        return false;
    }
    context.log("Valid Url.");
    return true;
}

/**
 * Get the text to use, either by parsing from the url or directly from the input
 * @param {*} parsedInput the input to the function
 * @param {*} context the azure functions context
 */
async function getParsedText(parsedInput, context) {
    // use mercury to get the web page text
    parsedTextResult = {};
    var url = parsedInput.url;
    try {
        context.log("Calling mercury service to parse text from url.");
        parsedTextResult = await Mercury.parse(url, {contentType: 'text'});
        context.log("Successfully retrieved parsed web page.");
    }
    catch (error) {
        context.log(error);
        throw error;
    }

    return parsedTextResult;
}

// The main function that is executed in the azure function
module.exports = async function (context, request) {
    var parsedInput = parseRequestInput(request, context);
    if (parsedInput.status != 200) {
        return parsedInput;
    }
    
    // use mercury to get the web page text or use the provided content
    try {
        var parsedTextResult = await getParsedText(parsedInput, context);
    }
    catch (error) {
        context.log(error);
        return {
            status: 500,
            body: error
        }
    }

    // Contruct the new response object
    var responseBody = {
        author: parsedTextResult.author || "",
        content: parsedTextResult.content || "",
        date_published: parsedTextResult.date_published || new Date(Date.UTC(0)).toJSON(),
        dek: parsedTextResult.dek || "",
        direction: parsedTextResult.direction || "",
        domain: parsedTextResult.domain || "",
        excerpt: parsedTextResult.excerpt || "",
        lead_image_url: parsedTextResult.lead_image_url || "",
        next_page_url: parsedTextResult.next_page_url || "",
        rendered_pages: parsedTextResult.rendered_pages || 0,
        title: parsedTextResult.title || "",
        total_pages: parsedTextResult.total_pages || 0,
        url: parsedTextResult.url || "",
        word_count: parsedTextResult.word_count || 0,
    };

    context.log("function executed successfully");
    var response = {
        status: 200,
        body: responseBody,
        headers: {
            "Content-Type": "application/json"
        }
    };
    return response;
};