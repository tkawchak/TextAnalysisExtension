(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"flesch-kincaid":2,"wordcount":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*eslint prefer-const: "error", sourceType: "module" */
/*eslint-env es6*/

var syllables = function syllables(x) {
    /*
     * basic algortithm: each vowel-group indicates a syllable, except for: final
     * (silent) e 'ia' ind two syl @AddSyl and @SubSyl list regexps to massage the
     * basic count. Each match from @AddSyl adds 1 to the basic count, each
     * @SubSyl match -1 Keep in mind that when the regexps are checked, any final
     * 'e' will have been removed, and all '\'' will have been removed.
     */
    var subSyl = [/cial/, /tia/, /cius/, /cious/, /giu/, // belgium!
    /ion/, /iou/, /sia$/, /.ely$/, // absolutely! (but not ely!)
    /sed$/];

    var addSyl = [/ia/, /riet/, /dien/, /iu/, /io/, /ii/, /[aeiouym]bl$/, // -Vble, plus -mble
    /[aeiou]{3}/, // agreeable
    /^mc/, /ism$/, // -isms
    /([^aeiouy])\1l$/, // middle twiddle battle bottle, etc.
    /[^l]lien/, // // alien, salient [1]
    /^coa[dglx]./, // [2]
    /[^gq]ua[^auieo]/, // i think this fixes more than it breaks
    /dnt$/];

    // (comments refer to titan's /usr/dict/words)
    // [1] alien, salient, but not lien or ebbullient...
    // (those are the only 2 exceptions i found, there may be others)
    // [2] exception for 7 words:
    // coadjutor coagulable coagulate coalesce coalescent coalition coaxial

    var xx = x.toLowerCase().replace(/'/g, '').replace(/e\b/g, '');
    var scrugg = xx.split(/[^aeiouy]+/).filter(Boolean); // '-' should be perhaps added?

    return undefined === x || null === x || '' === x ? 0 : 1 === xx.length ? 1 : subSyl.map(function (r) {
        return (xx.match(r) || []).length;
    }).reduce(function (a, b) {
        return a - b;
    }) + addSyl.map(function (r) {
        return (xx.match(r) || []).length;
    }).reduce(function (a, b) {
        return a + b;
    }) + scrugg.length - (scrugg.length > 0 && '' === scrugg[0] ? 1 : 0) +
    // got no vowels? ("the", "crwth")
    xx.split(/\b/).map(function (x) {
        return x.trim();
    }).filter(Boolean).filter(function (x) {
        return !x.match(/[.,'!?]/g);
    }).map(function (x) {
        return x.match(/[aeiouy]/) ? 0 : 1;
    }).reduce(function (a, b) {
        return a + b;
    });
};

var words = function words(x) {
    return (x.split(/\s+/) || ['']).length;
};
var sentences = function sentences(x) {
    return (x.split('. ') || ['']).length;
};
var syllablesPerWord = function syllablesPerWord(x) {
    return syllables(x) / words(x);
};
var wordsPerSentence = function wordsPerSentence(x) {
    return words(x) / sentences(x);
};

var rate = exports.rate = function rate(x) {
    return 206.835 - 1.015 * wordsPerSentence(x) - 84.6 * syllablesPerWord(x);
};
var grade = exports.grade = function grade(x) {
    return 0.39 * wordsPerSentence(x) + 11.8 * syllablesPerWord(x) - 15.59;
};


},{}],3:[function(require,module,exports){
/*!
 * match-words <https://github.com/jonschlinkert/match-words>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var regex = require('word-regex');

module.exports = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  return str.match(regex());
};

},{"word-regex":4}],4:[function(require,module,exports){
/*!
 * word-regex <https://github.com/jonschlinkert/word-regex>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

// Modified from: https://github.com/lepture/editor/blob/master/src/intro.js#L343
module.exports = function () {
  return /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
};

},{}],5:[function(require,module,exports){
/*!
 * wordcount <https://github.com/jonschlinkert/wordcount>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var matches = require('match-words');

module.exports = function wordcount(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  var m = matches(str);
  if (!m) return 0;
  return m.length;
};
},{"match-words":3}]},{},[1]);
