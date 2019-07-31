using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ProcessTextFunc.Models;

namespace ProcessTextFunc
{
    public static class ProcessTextHttp
    {
        [FunctionName("ProcessTextHttp")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest request, 
            ILogger log,
            [CosmosDB(
                databaseName: "AzureFunConnectionTest",
                collectionName: "testDocuments",
                ConnectionStringSetting = "tkawchak-textanalysis_DOCUMENTDB"
            )] IAsyncCollector<dynamic> outputDocument)
        {
            HttpResponseMessage httpResponse;
            log.LogInformation("C# HTTP trigger function processed a request.");

            // Get information from the headers
            string resultName = request.Query["name"];
            string resultUrl = request.Query["url"];
            string resultScore = request.Query["score"];
            string resultGrade = request.Query["grade"];
            string resultCount = request.Query["count"];
            
            // format the data for the response message
            string message = $"You sent a request with the values: name:{resultName}, url:{resultUrl}, score:{resultScore}, grade:{resultGrade}, and wordCount:{resultCount}";
            log.LogInformation(message);

            // make a call to the text parse api
            // https://textextractionfunc.azurewebsites.net/api/ExtractText?url=resultUrl&code=s23M3iar2EJ9iyXfPVeHWQtCRD6BO0cTI87YtvDhnAkVawaoVTCpAw==
            string functionCode = Environment.GetEnvironmentVariable("TextExtractionFuncCode");
            log.LogInformation($"{functionCode}");
            var requesturl = $"https://textextractionfunc.azurewebsites.net/api/ExtractText?url={resultUrl}&code={functionCode}";
            var client = new HttpClient();
            log.LogInformation("Parsing the url from the text extraction function api");
            var textExtractionResponse = await client.GetAsync(requesturl);
            TextExtractionResponse extractedText;
            if (textExtractionResponse != null)
            {
                log.LogInformation(await textExtractionResponse.Content.ReadAsStringAsync());
                extractedText = await textExtractionResponse.Content.ReadAsAsync<TextExtractionResponse>();
                log.LogInformation("Received the parsed website data.");
                log.LogInformation((extractedText == null).ToString());
            }
            else 
            {
                string errorMessage = "Unable to parse the website data.";
                log.LogError(errorMessage);
                httpResponse = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                httpResponse.Content = new StringContent(errorMessage);
                return httpResponse;
            }

            log.LogInformation(extractedText.Author);
            log.LogInformation(extractedText.Title);

            // Create a new document to store in cosmos db
            // TODO: Think of what other data to put in here
            // TODO: Include the published aritcle date
            // TODO: Get the Fleisch-Kincaid index and the grade reading level in C#
            await outputDocument.AddAsync( new {
                name = extractedText.Title,
                url = extractedText.Url,
                grade = resultGrade,
                score = resultScore,
                count = extractedText.WordCount,
                datetime = DateTime.Now.ToString()
            });

            // form the http response
            httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
            httpResponse.Content = new StringContent(message);
            return httpResponse;
        }
    }
}