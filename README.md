# Text Analysis Extension

This tool is being built as a Firefox Extension to perform analysis on webpage text.

## Setup
In order for these commands to run, you must have run the following commands to set everything up:
```
sudo npm install -g browserify
npm install daveross/flesch-kincaid
```

Run the browserify command to package everything into one .js file:
```
browserify fleschKincaidPractice.js -o bundle.js
```

Then, run the file with node:
```
node bundle.js
```
