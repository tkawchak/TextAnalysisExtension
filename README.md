# Text Analysis Extension

This tool is being built as a Firefox Extension to perform analysis on webpage text.

## Current Project Status
### Master Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=master)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=master)

### Develop Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=develop)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=develop)

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