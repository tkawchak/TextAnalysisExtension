import huggingface_hub
# Documentaiton taken from here: https://github.com/huggingface/huggingface_hub/tree/main/src/huggingface_hub#bonus-snapshot_download
# GPT Neo 1.3B https://huggingface.co/EleutherAI/gpt-neo-1.3B/tree/main
# GPT Neo 2.7B https://huggingface.co/EleutherAI/gpt-neo-2.7B

# How to load these weights as storage for azure functions
# https://docs.microsoft.com/en-us/azure/azure-functions/storage-considerations
# Map Azure Functions to storage account
# https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-mount-files-storage-linux

# huggingface_hub.hf_hub_download("EleutherAI/gpt-neo-1.3B", "pytorch_model.bin")

file_path = "./1.3B/EleutherAI__gpt-neo-1.3B.a4a110859b10643e414fbb4c171cae4b6b9c7e49"
# print("Downloading...")
# # TODO: Can I get a specific repo or should I just download latest??
# file_path = huggingface_hub.snapshot_download("EleutherAI/gpt-neo-1.3B", cache_dir="./1.3B/")
# print(f"Output directory: {file_path}")

from transformers import GPTNeoForCausalLM, GPT2Tokenizer
model = GPTNeoForCausalLM.from_pretrained(file_path)
tokenizer = GPT2Tokenizer.from_pretrained(file_path)

prompt = "I like to have my AI write for me."

input_ids = tokenizer(prompt, return_tensors="pt").input_ids

gen_tokens = model.generate(input_ids, do_sample=True, temperature=0.9, max_length=200,)
gen_text = tokenizer.batch_decode(gen_tokens)[0]
print(gen_text)
