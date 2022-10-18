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
    using Microsoft.Extensions.Primitives;
    using ProcessTextFunc.Contracts;
    using ProcessTextFunc.Utils;

    public static class GetProcessedText
    {
        [FunctionName("GetProcessedText")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "get", Route = null)] HttpRequest request,
            ILogger log,
            [Table(
                tableName: "WebPages",
                partitionKey: "{Query.domain}",
                rowKey: "{Query.id}",
                Connection = "TableStorageConnectionString")] ProcessedText document)
        {
            log.LogInformation("C# GetProcessedText function received request.");

            if (document != null)
            {
                var response = Converters.ConvertProcessedTextDocumentToGetTextResponse(document);
                return new OkObjectResult(response);
            }
            else
            {
                StringValues domain, title;
                if (request.Query.TryGetValue("domain", out domain) && request.Query.TryGetValue("id", out title))
                {
                    log.LogWarning($"Did not find any documents with title '{title}' and domain '{domain}'");
                    return new NotFoundObjectResult($"Title: {title}, Domain: {domain}");
                }
                else
                {
                    string error_message = "Both 'id' and 'domain' must be specified.";
                    log.LogWarning($"Invalid query string arguments specified. {error_message}");
                    return new BadRequestObjectResult(error_message);
                }
            }
        }
    }
}