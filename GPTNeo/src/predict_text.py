from transformers import GPTNeoForCausalLM, GPT2Tokenizer
from datetime import datetime
import asyncio
import os
import logging

from predicted_text import PredictedText
from table_storage import TableStorageClient

TABLE_NAME = "PredictedText"
INPUT_TEXT_ENV_VARIABLE = "TEXT"
INPUT_TITLE_ENV_VARIABLE = "TITLE"
INPUT_DOMAIN_ENV_VARIABLE = "DOMAIN"

MODEL_WEIGHTS_PATH_ENV_VARIABLE = "MODEL_WEIGHTS_PATH"

def main():
    logging.info(f"Running predict text main function")
    logging.info(f"Getting environment variables")
    input_text = os.getenv(INPUT_TEXT_ENV_VARIABLE)
    input_title = os.getenv(INPUT_TITLE_ENV_VARIABLE)
    input_domain = os.getenv(INPUT_DOMAIN_ENV_VARIABLE)
    logging.info(f"Environment: {INPUT_TEXT_ENV_VARIABLE} - {input_text}, {INPUT_TITLE_ENV_VARIABLE} - {input_title}, {INPUT_DOMAIN_ENV_VARIABLE} - {input_domain}")

    logging.info(f"Predicting text for input: {input_text}")
    try:
        predicted_text = predict_text(input_text)
        logging.info(f"Predicted text: {predicted_text}")
    except:
        logging.exception(f"Failed to predict text for input: {input_text}")

    logging.info(f"Uploading result to storage")
    try:
        asyncio.run(update_result(
            input_text=input_text,
            input_title=input_title,
            input_domain=input_domain,
            predicted_text=predicted_text
        ))
        logging.info(f"Uploaded result to storage")
    except:
        logging.exception(f"Failed to upload to storage")

def predict_text(input: str) -> str:
    logging.info(f"Getting model weights environment variable")
    model_weights_path = os.getenv(MODEL_WEIGHTS_PATH_ENV_VARIABLE)

    logging.info(f"Loading model weights from file: {model_weights_path}")
    model = GPTNeoForCausalLM.from_pretrained(model_weights_path)
    tokenizer = GPT2Tokenizer.from_pretrained(model_weights_path)
    logging.info(f"Loaded model weights from file: {model_weights_path}")

    input_ids = tokenizer(input, return_tensors="pt").input_ids

    logging.info(f"Generating text")
    gen_tokens = model.generate(input_ids, do_sample=True, temperature=0.9, max_length=200,)
    gen_text = tokenizer.batch_decode(gen_tokens)[0]
    logging.info(f"Generated text: {gen_text}")

    return gen_text
    
async def update_result(
    input_text: str,
    input_title: str,
    input_domain: str,
    predicted_text: str
):
    logging.info(f"Creating entity")
    entity = PredictedText(
        input_text=input_text,
        id=input_title,
        partition_key=input_domain,
        predicted_text=predicted_text,
        timestamp=datetime.now()
    )

    logging.info("Creating table storage client")
    client = TableStorageClient(TABLE_NAME)
    logging.info("Created table storage client")

    logging.info(f"Upserting entity: {entity}")
    upserted_entity = await client.upsert_entity_async(entity)
    logging.info(f"Upserted entity: {upserted_entity}")

if __name__ == "__main__":
    main()
