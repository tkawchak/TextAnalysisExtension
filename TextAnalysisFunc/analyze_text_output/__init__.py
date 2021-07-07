import logging
import json
import azure.functions as func
import azure.durable_functions as df

def main(document: str):
    logging.info("Running analyze_text_output function. Returning cosmos DB document.")
    return document
