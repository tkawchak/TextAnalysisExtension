import logging
import os
import azure.functions as func
from transformers import GPTNeoForCausalLM, GPT2Tokenizer

# from analytics.predict import predict_text
# MOUNT_DIR = "/gptneo"
MOUNT_DIR = "TextAnalysisExtension/GPTNeo"
MODEL_PATH = "1.3B/EleutherAI__gpt-neo-1.3B.a4a110859b10643e414fbb4c171cae4b6b9c7e49"
FILE_PATH = os.path.join(MOUNT_DIR, MODEL_PATH)

# TODO: Figure out what plan will support this kind of workload
# https://docs.microsoft.com/en-us/azure/azure-functions/dedicated-plan
# Answer - none of them. going with Azure Container Instances to run this

model = GPTNeoForCausalLM.from_pretrained(FILE_PATH)
tokenizer = GPT2Tokenizer.from_pretrained(FILE_PATH)

# This function has an activity trigger so that it fan be called from the orchestration function
def main(text: str) -> str:
    logging.info("predicting text")
    predicted = predict_text(text)
    return predicted
    
def predict_text(text: str) -> str:
    logging.info(f"predicting text from {text}")
    try:
        input_ids = tokenizer(text, return_tensors="pt").input_ids

        gen_tokens = model.generate(input_ids, do_sample=True, temperature=0.9, max_length=200,)
        gen_text = tokenizer.batch_decode(gen_tokens)[0]
        return gen_text
    except:
        logging.exception(f"Error predicting text.")
        return None
