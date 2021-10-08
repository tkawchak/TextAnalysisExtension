import logging
import azure.functions as func

from analytics.predict import predict_text

NUM_SENTENCES = 5

# This function has an activity trigger so that it fan be called from the orchestration function
def main(text: str) -> str:
    text = generate_text(text)
    return text
    
def generate_text(text: str) -> str:
    try:
        text = predict_text(text, NUM_SENTENCES)
        return text
    except:
        logging.exception(f"Error predicting text.")
        return None
