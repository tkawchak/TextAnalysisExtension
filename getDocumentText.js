// Load the Flesch-Kincaid Library
var FleschKincaid = require("flesch-kincaid");
var WordCount = require("wordcount");

// read the text content of the web page
var documentText = document.body.textContent;

// log the document text
// console.log(documentText);
console.log(`Flesch-Kincaid document text grade: ${FleschKincaid.grade(documentText)}`);
console.log(`Flesch-Kincaid document text rating: ${FleschKincaid.rate(documentText)}`);
console.log(`Word count for document text: ${WordCount(documentText)}`);
