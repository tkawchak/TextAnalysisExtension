import logging
import azure.functions as func

from analytics.summarize import generate_summary

NUM_SENTENCES = 5

# This function has an activity trigger so that it fan be called from the orchestration function
def main(text: str) -> str:
    logging.info("generating summary")
    summary = compute_summary_for_document(text)
    return summary
    
def compute_summary_for_document(text: str) -> str:
    logging.info("generating summary")
    try:
        summary = generate_summary(text, NUM_SENTENCES)
        logging.info(f"Summary: {summary}")
        return summary
    except:
        logging.exception(f"Error computing summary for text.")
        return None
