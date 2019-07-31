var Mercury = require('@postlight/mercury-parser');
// var url = 'https://www.foxnews.com/us/armed-man-reportedly-shot-after-throwing-incendiary-devices-at-ice-detention-center';

function parseRequestInput(request, context) {
    context.log("Parsing request input");
    if (request == null || request.query == null)
    {
        return {
            status: 400,
            body: "Please add request properties"
        }
    }
    context.log("Checking for valid url");
    var url = request.query["url"];
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
        url: url
    }
}

function isValidUrl(url, context) {
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

// for asynchronous functions
module.exports = async function (context, request) {
    var parsedInputResult = parseRequestInput(request, context);
    if (parsedInputResult.status != 200) {
        return parsedInputResult;
    }
    
    // use mercury to get the web page text
    var url = parsedInputResult.url;
    try {
        context.log("Calling mercury service to parse text from url.");
        var parsedTextResult = await Mercury.parse(url, {contentType: 'text'});
        context.log("Successfully retrieved parsed web page.");
    }
    catch (exception) {
        context.log(exception);
        return {
            status: 500,
            body: `Could not parse text from url '${url}' because of exception '${exception}'`
        }
    }

    context.log("function executed successfully");
    var response = {
        status: 200,
        body: parsedTextResult,
        headers: {
            "Content-Type": "application/json"
        }
    };
    return response;
};