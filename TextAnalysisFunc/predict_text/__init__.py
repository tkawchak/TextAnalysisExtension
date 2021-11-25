import logging
import os
import azure.functions as func
import openai

OPEN_AI_API_KEY = "OPENAI_API_KEY"
openai.api_key = os.getenv(OPEN_AI_API_KEY)

# This function has an activity trigger so that it fan be called from the orchestration function
def main(text: str) -> str:
    logging.info("predicting text")
    predicted = predict_text(text)
    logging.info(f"predicted text: {predicted}")
    return predicted
    
def predict_text(text: str, max_tokens: int = 20) -> str:
    logging.info(f"predicting text from {text}")
    predicted_text = None

    try:
        response = openai.Completion.create(
            engine="davinci",
            prompt=text,
            temperature=0.7,
            max_tokens=max_tokens)
        logging.info(response)
        num_choices = len(response["choices"])
        logging.info(f"Received {num_choices} possible choices")
        predicted_text = response["choices"][0]["text"]
    except:
        logging.exception(f"Error predicting text.")

    return predicted_text
