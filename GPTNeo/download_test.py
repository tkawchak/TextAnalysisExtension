import huggingface_hub 

huggingface_hub.hf_hub_download("EleutherAI/gpt-neo-1.3B", "pytorch_model.bin")

# from transformers import GPTNeoForCausalLM, GPT2Tokenizer
# model = GPTNeoForCausalLM.from_pretrained("EleutherAI/gpt-neo-1.3B")
# model.
# tokenizer = GPT2Tokenizer.from_pretrained("EleutherAI/gpt-neo-1.3B")
# tokenizer.save_pretrained("/path/to/file")