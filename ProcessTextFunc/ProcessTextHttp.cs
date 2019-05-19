using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Primitives;
using System.Globalization;

namespace ProcessTextFunc
{
    public static class ProcessTextHttp
    {
        [FunctionName("ProcessTextHttp")]
        public static HttpResponseMessage Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req, 
            ILogger log,
            [CosmosDB(
                databaseName: "AzureFunConnectionTest",
                collectionName: "testDocuments",
                ConnectionStringSetting = "tkawchak-textanalysis_DOCUMENTDB"
            )] out dynamic outputDocument)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            // Get information from the headers
            string resultName = req.Query["name"];
            string resultUrl = req.Query["url"];
            string resultScore = req.Query["score"];
            string resultGrade = req.Query["grade"];
            string resultCount = req.Query["count"];
            
            // format the data for the response message
            string message = $"You sent a request with the values: name:{resultName}, url:{resultUrl}, score:{resultScore}, grade:{resultGrade}, and wordCount:{resultCount}";
            log.LogInformation(message);

            // Get information from the body
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            // Create a new document to store in cosmos db
            outputDocument = new {
                name = resultName,
                url = resultUrl,
                grade = resultGrade,
                score = resultScore,
                count = resultCount,
                datetime = DateTime.Now.ToString()
            };

            // form the http response
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
            httpResponse.Content = new StringContent(message);
            return httpResponse;
        }
    }
}