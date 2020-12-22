import logging
import azure.functions as func

from analytics.summarize import generate_summary

NUM_SENTENCES = 5

def main(documents: func.DocumentList, outputdocument: func.Out[func.Document]):
    if documents:
        for document in documents:
            document_id = get_value_from_document(document, "id")
            logging.info(f"Document id: {document_id}")
            if should_compute_summary(document):
                document = compute_summary_for_document(document)
                if document is not None:
                    outputdocument.set(document)
            else:
                continue
    
    return

def get_value_from_document(document: func.Document, key: str) -> str:
    if key in document.keys():
        value = document[key]
    else:
        logging.warn(f"Key {key} is not present in document.")
        value = None
    return value

def should_compute_summary(document: func.Document) -> bool:
    content = get_value_from_document(document, "content")
    summary = get_value_from_document(document, "summary")
    id = get_value_from_document(document, "id")
    if summary is not None:
        logging.info(f"Summary is already computed for document with id {id}.")

    return summary is None and content is not None
    
def compute_summary_for_document(document: func.Document) -> func.Document:
    content = get_value_from_document(document, "content")
    id = get_value_from_document(document, "id")
    if content is None:
        logging.warn(f"Cannot compute summary if content is empty. Document id: {id}.")
        return None
    
    try:
        summary = generate_summary(content, NUM_SENTENCES)
        document["summary"] = summary
        return document
    except:
        logging.exception(f"Error computing summary for document with id {id}.")
        return None