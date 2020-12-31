var Readability = require('text-readability');
var natural = require("natural");

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

    context.log("Checking for valid content");
    var content = request.body["content"];
    var isContentValid = false;
    if (content != null && content.trim() != "")
    {
        isContentValid = true;
    }

    if (!isContentValid) {
        return {
            status: 400,
            body: "Please enter valid content to analyze."
        }
    }

    context.log("Parsed request data successfully.");
    return {
        status: 200,
        isContentValid: isContentValid,
        content: content,
    }
}

/**
 * Get the text to use, either by parsing from the url or directly from the input
 * @param {*} parsedInput the input to the function
 * @param {*} context the azure functions context
 */
async function getParsedText(parsedInput, context) {
    // use mercury to get the web page text
    parsedTextResult = {};
    context.log("Url not specified. Parsing user entered text");
    text = parsedInput.content;
    if (text == null || text.trim() == "")
    {
        throw `Could not parse text content`
    }
    parsedTextResult["content"] = text;

    return parsedTextResult;
}

/**
 * split the text into sentences and then rejoin it to 
 * get rid of newlines and other separators
 * The documentation for this tokenizer can be found here
 * https://github.com/NaturalNode/natural#tokenizers
 * This is from the 'natural' npm package
 * @param {string} text the text to split
 * @param {*} context the azure function context
 */
function splitSentences(text, context) {
    context.log("parsing sentences...");

    // Right now, the SentenceTokenizerNew is better, but not as robust as
    // SentenceTokenizer, so we will try to use sentenceTokenizerNew and
    // then default to SentenceTokenizer if there are errors
    try {
        var tokenizer = new natural.SentenceTokenizerNew();
        sentences = tokenizer.tokenize(text);
    }
    catch (error) {
        context.log(`Unable to parse with SentenceTokenizerNew because of ${error}`);
        tokenizer = new natural.SentenceTokenizer();
        sentences = tokenizer.tokenize(text);
    }

    // If the split sentence does not end in punctuation, then add a period because
    // we need to be able to distinguish sentences after smushing them together.
    for (var i=0; i<sentences.length; i++) {
        if (sentences[i].match("([^.!?]*[.!?])+") == null) {
            context.log(`Sentence without ".": ${sentences[i]}`);
            sentences[i] = sentences[i] + ".";
        }
    }
    // When the sentences are split, they still contain the punctuation
    // so we only need to add a space when joining.
    var joinedSentences = sentences.join(" ");

    return joinedSentences;
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

    // parse into sentences and join them back together
    var content = splitSentences(parsedTextResult.content, context);
    // var content = parsedTextResult.content;

    // Compute a bunch of readability metrics
    var syllableCount = Readability.syllableCount(content, lang='en-US');
    var lexiconCount = Readability.lexiconCount(content, removePunctuation=true);
    var sentenceCount = Readability.sentenceCount(content);
    var difficultWords = Readability.difficultWords(content);
    var averageSentenceLength = Readability.averageSentenceLength(content);
    var lixReadabilityIndex = Readability.lix(content);
    var fleschEase = Readability.fleschReadingEase(content);
    var fleschKincaidGrade = Readability.fleschKincaidGrade(content);
    var colemanLiauIndex = Readability.colemanLiauIndex(content);
    var automatedReadabilityIndex = Readability.automatedReadabilityIndex(content);
    var daleChallReadabilityScore = Readability.daleChallReadabilityScore(content);
    var linsearWriteIndex = Readability.linsearWriteFormula(content);
    var gunningFogIndex = Readability.gunningFog(content);
    var smogIndex = Readability.smogIndex(content);
    var overallScore = Readability.textStandard(content);

    // Contruct the new response object
    var responseBody = {
        author: parsedTextResult.author || "",
        content: content || "",
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