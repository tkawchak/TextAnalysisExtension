# Text Analysis Extension

This tool is being built as a Firefox Extension to perform analysis on webpage text.

## Clone the Repo
```
git clone https://github.com/tkawchak/TextAnalysisExtension.git
```

## Install Dependencies
In order for these commands to run, you must install the dependencies from the packages.json file.
```
npm install
```
There is a change you will need to add sudo to this command if you do not have proper permissions.
```
sudo npm install
```

## Build
Run the browserify command to package everything into one .js file:
```
browserify getDocumentText.js -o getDocumentTextBundle.js
```

## Run
Open up a new window in firefox and go to the page 
```
about:debugging#addons
```
Click the button that says
```
Load Temporary Add-on...
```
And select the manifest.json file in this repository.

The extension will work on any mozilla.org domain and subdomain now!