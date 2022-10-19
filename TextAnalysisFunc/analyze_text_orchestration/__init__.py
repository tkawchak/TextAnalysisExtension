import logging
import json
import azure.functions as func
import azure.durable_functions as df

def analyze_text_orchestration(context: df.DurableOrchestrationContext):
    logging.info("starting analyze_text_orchestration")

    input = context.get_input()

    document = json.loads(input)
    logging.info(f"processing document with title: {document['title']}")
    content = document["content"]
    title = document["title"]

    # Call the activity functions
    logging.info("calling summarize_webpage function")
    summary = yield context.call_activity("summarize_webpage", content)
    logging.info(f"summary: {summary}")
    document["summary"] = summary

    logging.info("calling predict_text function")
    predicted_text = yield context.call_activity("predict_text", title)
    logging.info(f"predicted text: {predicted_text}")
    document["predicted"] = predicted_text

    # output the results of the analysis
    logging.info("calling analyze_text_output function")
    yield context.call_activity("analyze_text_output", json.dumps(document))
    
    return document

main = df.Orchestrator.create(analyze_text_orchestration)
