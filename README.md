# Text Analysis Extension

This tool is being built as a Firefox Extension to perform analysis on webpage text.

## Current Project Status
### Master Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=master)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=master)

### Develop Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=develop)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=develop)

# Get Started Developing / Using the Extension
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

## Package the Extension
```
npm run package
```
Under the hood, this uses the browserify command to package everything into two .js files.  One is requestServiceBundle.js and the other is getDocumentText.js.  requestServiceBundle.js is the background script that communicates with the azure resources and handles the extension events.  getDocumentText.js is the content script that can interact with the active web page and send data to the background script to be processed and sent to Azure.

## Run
Make sure to follow the instructions in [Package the Extension](##Package-the-Extension) prior to running the extension.

Open up a new window in firefox and go to the page 
```
about:debugging#addons
```
Click the button that says
```
Load Temporary Add-on...
```
And select the manifest.json file in this repository.

The extension will work on any mozilla.org domain and subdomain right now.  Support for all web sites will be coming soon!


Inquiries about how to get the data?  Contact [Tom](mailto:tkawchak@gmail.com)