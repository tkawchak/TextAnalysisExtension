using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

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

            // format the data for the response message
            string url = request.Query["url"];
            string message = $"You sent a request to store data for webpage at {url}.";
            log.LogInformation(message);

            // Create a new document to store in cosmos db
            // Specifies all of the fields that are stored in the db entry
            // TODO: Figure out how to put these query parameters into the request body
            // and parse the request body into an object.
            // TODO: These are query parametrs so their values are strings.  How to parse
            // as ints or dates, etc.
            string author = request.Query["author"];
            string text = request.Query["text"];
            string date_published = request.Query["date_published"];
            string domain = request.Query["domain"];
            string excerpt = request.Query["excerpt"];
            string lead_image_url = request.Query["lead_image_url"];
            string title = request.Query["title"];
            string syllable_count = request.Query["syllable_count"];
            string lexicon_count = request.Query["lexicon_count"];
            string sentence_count = request.Query["sentence_count"];
            string average_sentence_length = request.Query["average_sentence_length"];
            string lix_readability_index = request.Query["lix_readability_index"];
            string flesch_ease = request.Query["flesch_ease"];
            string fleschkincaid_grade = request.Query["fleschkincaid_grade"];
            string coleman_liau_index = request.Query["coleman_liau_index"];
            string automated_readability_index = request.Query["automated_readability_index"];
            string dale_chall_readability_score = request.Query["dale_chall_readability_score"];
            string difficult_words = request.Query["difficult_words"];
            string linsear_write_index = request.Query["linsear_write_index"];
            string gunning_fog_index = request.Query["gunning_fog_index"];
            string smog_index = request.Query["smog_index"];
            string overall_score = request.Query["overall_score"];

            await outputDocument.AddAsync( new {
                author = author,
                text = text,
                date_published = date_published,
                domain = domain,
                excerpt = excerpt,
                lead_image_url = lead_image_url,
                title = title,
                url = url,
                syllable_count = syllable_count,
                lexicon_count = lexicon_count,
                sentence_count = sentence_count,
                average_sentence_length = average_sentence_length,
                lix_readability_index = lix_readability_index,
                flesch_ease = flesch_ease,
                fleschkincaid_grade = fleschkincaid_grade,
                coleman_liau_index = coleman_liau_index,
                automated_readability_index = automated_readability_index,
                dale_chall_readability_score = dale_chall_readability_score,
                difficult_words = difficult_words,
                linsear_write_index = linsear_write_index,
                gunning_fog_index = gunning_fog_index,
                smog_index = smog_index,
                overall_score = overall_score,
                datetime = DateTime.Now.ToString()
            });

            // form the http response
            httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
            httpResponse.Content = new StringContent(message);
            return httpResponse;
        }
    }
}