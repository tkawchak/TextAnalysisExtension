import logging
import os
import azure.functions as func
import openai

OPEN_AI_API_KEY = "OPENAI_API_KEY"
OPEN_AI_MODEL = "curie"
OPEN_AI_TEMPERATURE = 0.7
openai.api_key = os.getenv(OPEN_AI_API_KEY)

# This function has an activity trigger so that it fan be called from the orchestration function
def main(text: str) -> str:
    logging.info("predicting text")
    predicted = predict_text(text)
    logging.info(f"predicted text: {predicted}")
    return predicted
    
def predict_text(text: str, max_tokens: int = 50) -> str:
    logging.info(f"predicting text from {text}")
    predicted_text = None

    try:
        response = openai.Completion.create(
            engine=OPEN_AI_MODEL,
            prompt=text,
            temperature=OPEN_AI_TEMPERATURE,
            max_tokens=max_tokens,
        )
        logging.info(response)
        num_choices = len(response["choices"])
        logging.info(f"Received {num_choices} possible choices")
        predicted_text = response["choices"][0]["text"]
    except:
        logging.exception("Error predicting text.")

    return predicted_text
