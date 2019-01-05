// Load the Flesch-Kincaid Library
var FleschKincaid = require("flesch-kincaid");

var str01 = "The quick brown fox jumped over the lazy dogs.";
console.log("String 1");
console.log(str01);
console.log(`Grade: ${FleschKincaid.grade(str01)}`);
console.log(`Rate: ${FleschKincaid.rate(str01)}`);

var str02 = "I like big butts and I cannot lie.  You other brothers can't deny.  And when a girl walks in with an itty bitty wasit and a round thing in your face you get sprung.  Wanna pull up tuck cuz you noticed that butt was stuffed.  Deep in the jeans she's wearnin';  I'm hooked and I can't stop sharing.  Oh, baby I wanna get witcha and take your picture.  My homeboys tried to warn me but that butt you got makes me so horny."
console.log("String 2");
console.log(str02);
console.log(`Grade: ${FleschKincaid.grade(str02)}`);
console.log(`Rate: ${FleschKincaid.rate(str02)}`);
