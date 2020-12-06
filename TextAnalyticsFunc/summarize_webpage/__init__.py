import logging
import azure.functions as func

from analytics.summarize import generate_summary

def main(documents: func.DocumentList) -> func.Document:
    if documents:
        for doc in documents:
            logging.info('Document id: %s', doc['id'])

        logging.info("Setting document summary parameter")
        document = documents[0]
        if "content" in document.keys():
            content = document["content"]
            document["summary"] = generate_summary(content, 4)
        return document
