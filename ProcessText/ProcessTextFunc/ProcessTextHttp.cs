// <copyright file="ProcessTextHttp.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProcessTextFunc
{
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using ProcessTextFunc.Contracts;

    public static class ProcessTextHttp
    {
        // Service bus trigger examples
        // https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-functions/functions-bindings-service-bus-output.md#c-2
        [FunctionName("ProcessTextHttp")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "post", Route = null)] HttpRequest request,
            [ServiceBus(
                "processtext",
                Connection = "ProcessTextQueueServicebusConnectionString")] IAsyncCollector<dynamic> processTextQueue,
            [Table(
                tableName: "WebPages",
                Connection = "TableStorageConnectionString")] IAsyncCollector<ProcessedText> outputDocument,
            ILogger log)
        {
            ObjectResult httpResponse;
            log.LogInformation("C# ProcessTextHttp function received request.");

            // format the data for the response message
            string bodyContent = string.Empty;
            string errorMessage = string.Empty;
            using (var reader = new StreamReader(request.Body))
            {
                bodyContent = await reader.ReadToEndAsync();
            }

            ProcessTextRequest requestContent;
            if (string.IsNullOrWhiteSpace(bodyContent))
            {
                errorMessage = "Error processing request - Request Body is empty. Cannot process an empty body.";
            }

            requestContent = JsonConvert.DeserializeObject<ProcessTextRequest>(bodyContent);
            if (string.IsNullOrWhiteSpace(requestContent.Title))
            {
                errorMessage = "Error processing request - Title not specified";
            }

            if (string.IsNullOrWhiteSpace(requestContent.Domain))
            {
                errorMessage = "Error processing request - Domain not specified";
            }

            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                log.LogError(errorMessage);
                httpResponse = new BadRequestObjectResult(errorMessage);
                return httpResponse;
            }

            log.LogInformation($"Received request to store data for webpage at {requestContent.Url}");
            var outputDoc = Utils.Converters.ConvertProcessTextRequestToProcessedTextDocument(requestContent);
            log.LogInformation($"Document Title: {outputDoc.Title}");
            log.LogInformation($"Document Domain: {outputDoc.Domain}");

            await processTextQueue.AddAsync(outputDoc);
            log.LogInformation($"Sent webpage data to process text queue");

            await outputDocument.AddAsync(outputDoc);
            log.LogInformation($"Stored webpage data to storage");

            string message = $"Successfully Processed request to store data for webpage at {requestContent.Domain}.";
            log.LogInformation(message);
            httpResponse = new OkObjectResult(message);

            return httpResponse;
        }
    }
}