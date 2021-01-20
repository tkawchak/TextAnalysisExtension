# Text Analysis Extension
This tool is being built as a Firefox Extension to perform analysis on webpage text.

## Current Functionalities
* Analyze Readability of an entire webpage
* Analyze Readability of selected text on a webpage
* Analyze Readability of custom text
* Computes a summary of a webpage using Extractive Summarization
* Analyze image content in webpages

## Future Directions
* Compute Summaries uses Generative Summarization
* Give suggestions for how to improve content writing quality / readability.

Other ideas? Let me know by creating an issue!

## Project Status
### Master Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=master)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=master)

### Develop Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=develop)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=develop)

# Readability Scores
Often the best way to "improve" these readability scores by making text more readable is to use shorter sentences and shorter words.

## Flesch-Kincaid Readability
There are two [Flesch-Kincaid Readability Tests](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) and both can be used to score text readability.
### Flesch Reading-Ease
This score ranges from 0 (very difficult to read) to 100 (very easy to read). It is computed with the following formula. 

206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)

This score is affected more by words with many syllables.
### Flesh-Kincaid Grade
This is used more extensively for education, as it computes an estimated grade level. It is computed with the following formula.

0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59

This grade level emphasizes sentence length over word length.

## Gunning Fog Index
The [Gunning Fog Index](https://en.wikipedia.org/wiki/Gunning_fog_index) estimates the number of years of education someone needs to have in order to understand text on the first reading. So, a score of 12 means that an average person who graduated high school should be able to understand the text after reading it once. Per the wikipedia entry on gunning fog, "Texts for a wide audience generally need a fog index less than 12. Texts requiring near-universal understanding generally need an index less than 8."

It is computed by the following formula, where "complex words" are words with 3 or more syllables.

0.4 * ((words / sentences) + 100 * (complex words / words))

To reduce this score, use less complex words with fewer syllables because they will be easier to understand.

# Get the Code
```
git clone https://github.com/tkawchak/TextAnalysisExtension.git
```

# Developing the Browser Extension

## Navigate to the Browser Extension Folder
Form the base folder of the repository, type:
```
cd BrowserExtension
```

## Install Dependencies
In order for these commands to run, you must install the dependencies from the packages.json file.
```
npm install
```
You will need to add sudo to this command if you do not have proper permissions.
```
sudo npm install
```

## Package the Extension
```
npm run package
```
Under the hood, this uses the browserify command to package everything into two .js files.  One is requestServiceBundle.js and the other is getDocumentText.js.  requestServiceBundle.js is the background script that communicates with the azure resources and handles the extension events.  getDocumentText.js is the content script that can interact with the active web page and send data to the background script to be processed and sent to Azure.

## Test the Extension
```
npm test
```
or
```
npm run test
```

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
And select the **manifest.json** file in this repository.  The extension will be working in your Firefix Browswer!

# Developing the Azure Function to Process Text
## Navigate to the Folder Containing the Azure Function
From the root of the repository, type: 
```
cd ProcessText
```

## Install the Azure Function Development Tools
Run the following command to install the npm package azure-function-core-tools globally.  Visit the [Azure Functions Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for more information on Azure Functions.
```
npm install -g azure-functions-core-tools
```

## Set the local.settings.json file settings
Edit or create the file at the location
```
ProcessText/ProcessTextFunc/local.settings.json
```
Replace the settings with the proper connections and values for the cosmosDB and Azure Functions Azure Resources.

***TODO: Update this with the proper local contents of the local.settings.json file***

## Run the Process Text Azure Function
Change to the proper folder:
```
cd ProcessText/ProcessTextFunc
```

Start the Azure Functions host.  Run the Start Command.
```
func host start --port 7071
```
or 
```
func start --port 7071
```

## Test the Process Text Azure Function
Change to the proper folder:
```
cd ProcessText/ProcessTextFunc.Tests
```

Run the dotnet test command:
```
dotnet test
```
This will run all tests in the project.

## Run the Text Extraction Azure Function
Change to the proper folder:
```
cd TextExtractionFunc
```

Start the Azure Functions host.  This must be on a separate port form the Process Text Function
```
func host start --port 7072
```
or
```
func start --port 7072
```

# Contact
Inquiries about how to get the data?  Contact [Tom](mailto:tkawchak@gmail.com)