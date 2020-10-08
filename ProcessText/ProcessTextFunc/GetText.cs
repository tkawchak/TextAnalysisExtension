using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ProcessTextFunc.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace ProcessTextFunc
{
    public static class GetProcessedText
    {
        [FunctionName("GetProcessedText")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(
                AuthorizationLevel.Function, "get", Route = null)] HttpRequest request,
            ILogger log,
            [CosmosDB(
                databaseName: "AzureFunConnectionTest",
                collectionName: "testDocuments",
                ConnectionStringSetting = "tkawchak-textanalysis_DOCUMENTDB",
                Id = "{Query.id}",
                PartitionKey = "{Query.partitionKey}"
            )] ProcessedText document)
        {
            log.LogInformation("C# GetProcessedText function received request.");

            if (document != null)
            {
                return new OkObjectResult(document);
            }
            else
            {
                return new NotFoundObjectResult(request.Query);
            }
        }
    }
}