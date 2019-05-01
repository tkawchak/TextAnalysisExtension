// Load the request library for making http requests
const request = require('request');

var documentTitle = "Hello";
var documentUrl = "example.com";
var documentGrade = "2";
var documentScore = "72.39";
var documentWordCount = "12398123"
// send a request to the azure function
request({
    uri: "https://tkawchak-textanalysis.azurewebsites.net/api/HttpTrigger1",
    method: "GET",
    timeout: 10000,
    qs: {
        code: "HZcgMXeKKoZ92cnvsqAFMDKBVnP4cDBZ5mEcwKsgOGWfFEpsiQmGUg==",
        name: documentTitle,
        url: documentUrl,
        grade: documentGrade,
        score: documentScore,
        count: documentWordCount
    }
}, function (error, response, body) {
    console.log("ERROR: ", error)
    console.log("RESPONSE STATUS CODE: ", response && response.statusCode);
    console.log("RESPONSE BODY: ", body);
});