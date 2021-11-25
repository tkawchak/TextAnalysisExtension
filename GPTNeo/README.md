# Predict Text Docker Image

## Background

## Building the image
```bash
docker build . --tag tkawchak.azurecr.io/predicttext:latest
```

## Running the image
```bash
docker run --env-file ./envfile -v /Users/tomkawchak/Programs/firefoxExtensions/TextAnalysisExtension/GPTNeo/1.3B/:/mnt/modelWeights/GPTNeo/1.3B tkawchak.azurecr.io/predicttext:latest
```

## Environment variables
NOTE: The environment variables are not checked into the repo in the envfile because they may contain sensitive information. You should set the following variables:

| Variable | Description |
| - | - |
| TEXT | The input text to predict from |
| TITLE | The title of the page where the text is from |
| DOMAIN | The domain of the website. Something like www.example.com |
| MODEL_WEIGHTS_PATH | The path where the model weights are mounted to the docker container. Something like /mnt/modelWeights/GPTNeo/1.3B/EleutherAI__gpt-neo-1.3B.a4a110859b10643e414fbb4c171cae4b6b9c7e49 |
| TABLE_STORAGE_CONNECTION_STRING | The connection sring to the table storage account |
