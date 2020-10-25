using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ProcessTextFunc.Contracts;
using ProcessTextFunc.Exceptions;
using Newtonsoft.Json;

namespace ProcessTextFunc
{
    public static class ProcessTextHttp
    {
        [FunctionName("ProcessTextHttp")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "post", Route = null)] HttpRequest request,
            ILogger log,
            [CosmosDB(
                databaseName: "TextContent",
                collectionName: "Web",
                ConnectionStringSetting = "tkawchak-textanalysis_DOCUMENTDB"
            )] IAsyncCollector<dynamic> outputDocument)
        {
            HttpResponseMessage httpResponse;
            log.LogInformation("C# ProcessTextHttp function received request.");

            // format the data for the response message
            string bodyContent = string.Empty;
            ProcessTextRequest requestContent;
            using (var reader = new StreamReader(request.Body))
            {
                bodyContent = await reader.ReadToEndAsync();
            }

            // TODO: Add better error handling here
            if (!bodyContent.Equals(string.Empty))
            {
                requestContent = JsonConvert.DeserializeObject<ProcessTextRequest>(bodyContent);
                if (string.IsNullOrWhiteSpace(requestContent.Title))
                {
                    throw new MissingPropertyException("Title not specified");
                }
                if (string.IsNullOrWhiteSpace(requestContent.Domain))
                {
                    throw new MissingPropertyException("Domain not specified.");
                }
                log.LogInformation($"Received request to store data for webpage at {requestContent.Url}");

                var outputDoc = Utils.Converters.ConvertProcessTextRequestToProcessedTextDocument(requestContent);
                await outputDocument.AddAsync(outputDoc);

                httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
                string message = $"Successfully Processed request to store data for webpage at {requestContent.Domain}.";
                log.LogInformation(message);
                httpResponse.Content = new StringContent(message);
            }
            else
            {
                string message = "Request Body is empty.  Cannot process an empty body.";
                log.LogError(message);

                httpResponse = new HttpResponseMessage(HttpStatusCode.NoContent)
                {
                    Content = new StringContent(message)
                };
            }

            return httpResponse;
        }
    }
}