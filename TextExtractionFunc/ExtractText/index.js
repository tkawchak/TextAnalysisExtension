var Mercury = require('@postlight/mercury-parser');
// var url = 'https://www.foxnews.com/us/armed-man-reportedly-shot-after-throwing-incendiary-devices-at-ice-detention-center';
//var FleschKincaid = require("flesch-kincaid");
var Readability = require('text-readability');

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

// The main function that is executed in the azure function
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

    // Compute a bunch of readability metrics
    var syllableCount = Readability.syllableCount(parsedTextResult.content, lang='en-US');
    var lexiconCount = Readability.lexiconCount(parsedTextResult.content, removePunctuation=true);
    var sentenceCount = Readability.sentenceCount(parsedTextResult.content);
    var difficultWords = Readability.difficultWords(parsedTextResult.content);
    var averageSentenceLength = Readability.averageSentenceLength(parsedTextResult.content);
    var lixReadabilityIndex = Readability.lix(parsedTextResult.content);
    var fleschEase = Readability.fleschReadingEase(parsedTextResult.content);
    var fleschKincaidGrade = Readability.fleschKincaidGrade(parsedTextResult.content);
    var colemanLiauIndex = Readability.colemanLiauIndex(parsedTextResult.content);
    var automatedReadabilityIndex = Readability.automatedReadabilityIndex(parsedTextResult.content);
    var daleChallReadabilityScore = Readability.daleChallReadabilityScore(parsedTextResult.content);
    var linsearWriteIndex = Readability.linsearWriteFormula(parsedTextResult.content);
    var gunningFogIndex = Readability.gunningFog(parsedTextResult.content);
    var smogIndex = Readability.smogIndex(parsedTextResult.content);
    var overallScore = Readability.textStandard(parsedTextResult.content);

    // Contruct the new response object
    var responseBody = {
        author: parsedTextResult.author || "",
        content: parsedTextResult.content || "",
        date_published: parsedTextResult.date_published || new Date(Date.UTC(0)).toJSON(),
        //dek: parsedTextResult.dek,
        // direction: parsedTextResult.direction,
        domain: parsedTextResult.domain || "",
        excerpt: parsedTextResult.excerpt || "",
        lead_image_url: parsedTextResult.lead_image_url || "",
        //next_page_url: parsedTextResult.next_page_url,
        //rendered_pages: parsedTextResult.rendered_pages,
        title: parsedTextResult.title || "",
        //total_pages: parsedTextResult.total_pages,
        url: parsedTextResult.url || "",
        //word_count: parsedTextResult.word_count,
        syllable_count: syllableCount || 0,
        lexicon_count: lexiconCount || 0,
        sentence_count: sentenceCount || 0,
        average_sentence_length: averageSentenceLength || 0,
        lix_readability_index: lixReadabilityIndex || 0,
        flesch_ease: fleschEase || 0,
        fleschkincaid_grade: fleschKincaidGrade || 0,
        coleman_liau_index: colemanLiauIndex || 0,
        automated_readability_index: automatedReadabilityIndex || 0,
        dale_chall_readability_score: daleChallReadabilityScore || 0,
        difficult_words: difficultWords || 0,
        linsear_write_index: linsearWriteIndex || 0,
        gunning_fog_index: gunningFogIndex || 0,
        smog_index: smogIndex || 0,
        overall_score: overallScore || ""
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