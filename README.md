# Text Analysis Extension
This tool is being built as a Firefox Extension to perform analysis on webpage text. Use it to analyze the readability of your favorite webpages, selected text on a webpage, or while composing your emails. Use it and let me know what you think!

## Project CI Status
### Master Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=master)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=master)

### Develop Build
[![Build Status](https://dev.azure.com/tkawchak/TextAnalysisExtension/_apis/build/status/tkawchak.TextAnalysisExtension?branchName=develop)](https://dev.azure.com/tkawchak/TextAnalysisExtension/_build/latest?definitionId=2&branchName=develop)

## Current Functionalities
* Analyze Readability of an entire webpage
* Analyze Readability of selected text on a webpage
* Analyze Readability of custom text
* Computes a summary of a webpage using Extractive Summarization
* Analyze image content in webpages

## Future Directions
* Compute Summaries using Generative Summarization
* Give suggestions for how to improve content writing quality / readability.
* Add support for other browsers

Other ideas? Let me know by creating an issue!

# Data collection
The extension does not collect any personal data. The only data that is stored in a cosmos DB instance is webpage data, extracted text, and any computed metrics such as a summary and readability metrics.

# Get the Code
```bash
git clone https://github.com/tkawchak/TextAnalysisExtension.git
```

# Developing the Browser Extension

## Navigate to the Browser Extension Folder
Form the base folder of the repository, type:
```bash
cd BrowserExtension
```

## Install Dependencies
In order for these commands to run, you must install the dependencies from the packages.json file.
```bash
npm install
```
You will need to add sudo to this command if you do not have proper permissions.
```bash
sudo npm install
```

## Package the Extension
```bash
npm run build
```
Under the hood, this uses the browserify command to package everything into web-compatible .js files. This project is using parcel to build the extension: https://parceljs.org/recipes/web-extension/

## Test the Extension
```bash
npm test
```
or
```bash
npm run test
```

## Other commands
See the package.json file for more commands including "clean", "watch" to build whenever you make changes, and others.

## Load the Extension into Firefox
Make sure to follow the instructions in [Package the Extension](##Package-the-Extension) prior to running the extension.

Open up a new window in firefox and go to the page 
```
about:debugging#addons
```
Click the button that says
```
Load Temporary Add-on...
```
And select the **manifest.json** file in this repository. The extension will be working in your Firefix Browswer!

# Install the Azure Function Development Tools
Visit the [Azure Functions Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for how to do this for your platform.

# Azure Function to Process Webpage Text
Change to the proper folder (from the root of the project).
```bash
cd ProcessText/ProcessTextFunc
```

## Set the local.settings.json file settings
Edit or create the file at the location
```bash
ProcessText/ProcessTextFunc/local.settings.json
```
Replace the settings with the proper connections and values for the cosmosDB and Azure Functions Azure Resources.

***TODO: Update this with the proper local contents of the local.settings.json file***

## Install Dependensies
```bash
dotnet restore
```

## Run the Azure Functions
Start the Azure Functions host.  Run the Start Command.
```bash
func host start --port 7071
```
or 
```bash
func start --port 7071
```

## Test the Azure Functions
Change to the proper folder:
```bash
cd ProcessText/ProcessTextFunc.Tests
```

Run the dotnet test command:
```bash
dotnet test
```
This will run all tests in the project.

# Azure function to Extract Text (Javascript)
Change to the proper folder:
```bash
cd TextExtractionFunc
```

## Run the Azure Functions
Start the Azure Functions host. This must be on a separete port from other Azure Functions.
```bash
func host start --port 7072
```
or
```bash
func start --port 7072
```

## Install packages
```bash
npm install
```

## Test the Azure Functions
Run all tests.
```bash
npm run test
```

# Azure Functions to Analyze Text (Python)
Change to the proper folder:
```bash
cd TextAnalysisFunc
```

## Install packages
```bash
pip install -r requirements.txt
```

## Run the Azure Functions
Start the Azure Functions host. This must be on a separete port from other Azure Functions.
```bash
func host start --port 7073
```
or
```bash
func start --port 7073
```

## Test the Azure Functions
See the TextAnalysisFunc/README.md for details on testing.

# Contact
Inquiries about how to get data or help with the project? Contact [Tom](mailto:tkawchak@gmail.com)