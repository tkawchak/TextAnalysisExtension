// <copyright file="GetText.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProcessTextFunc
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Extensions.Logging;
    using ProcessTextFunc.Contracts;
    using ProcessTextFunc.Utils;

    public static class GetProcessedText
    {
        [FunctionName("GetProcessedText")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "get", Route = null)] HttpRequest request,
            ILogger log,
            [CosmosDB(
                databaseName: "TextContent",
                collectionName: "Web",
                ConnectionStringSetting = "tkawchak-textanalysis_DOCUMENTDB",
                Id = "{Query.id}",
                PartitionKey = "{Query.domain}")] ProcessedText document)
        {
            log.LogInformation("C# GetProcessedText function received request.");

            if (document != null)
            {
                var response = Converters.ConvertProcessedTextDocumentToGetTextResponse(document);
                return new OkObjectResult(response);
            }
            else
            {
                return new NotFoundObjectResult(request.Query);
            }
        }
    }
}