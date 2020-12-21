from nltk import download
from nltk.corpus import stopwords
from nltk.cluster.util import cosine_distance
import nltk.data
import numpy as np
import networkx as nx

import logging
from typing import List

TEXT_TO_REMOVE = ["\n"]
nltk.download("punkt")

def get_sentences(content: str) -> List[str]:
    content = content.strip()
    # lines = content.splitlines()
    lines = content.split("\\n")
    # print("lines: ", lines)
    sentences = []
    sentence_detector = nltk.data.load('tokenizers/punkt/english.pickle')
    for line in lines:
        line = line.strip()
        # print(line)
        line_sentences = sentence_detector.tokenize(line)
        for sentence in line_sentences:
            sentence.strip()
            # print(sentence)
            sentences.append(sentence)
    
    sentence_word_lists = []
    for sentence in sentences:
        # print(sentence)
        sentence_text = sentence.replace("[^a-zA-Z0-9]", " ").strip()
        sentence_words = sentence_text.split(" ")

        sentence_word_lists.append(sentence_words)
    
    return sentence_word_lists
    # TODO: Can this be a generaor to make it optimized?
    # for sentence in sentences:
    #     yield sentence

def sentence_similarity(sentence1: str, sentence2: str, stopwords: List[str]=None):
    if stopwords is None:
        stopwords = []

    sentence1_wordlist = [word.lower() for word in sentence1]
    sentence2_wordlist = [word.lower() for word in sentence2]

    all_words = list(set(sentence1_wordlist + sentence2_wordlist))

    # TODO: Can we use np.zeros for this?
    sentence1_vector = [0] * len(all_words)
    sentence2_vector = [0] * len(all_words)

    for word in sentence1_wordlist:
        if word in stopwords:
            continue
        sentence1_vector[all_words.index(word)] += 1

    for word in sentence2_wordlist:
        if word in stopwords:
            continue
        sentence2_vector[all_words.index(word)] += 1

    return 1 - cosine_distance(sentence1_vector, sentence2_vector)

def build_similarity_matrix(sentences: List[str], stop_words: List[str]):
    # Create an empty similarity matrix
    similarity_matrix = np.zeros((len(sentences), len(sentences)))

    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 == idx2: #ignore if both are same sentences
                continue 
            similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1], sentences[idx2], stop_words)
    
    return similarity_matrix

def remove_unwanted_chars(text: str) -> str:
    for string in TEXT_TO_REMOVE:
        text = text.replace(string, "")
    
    return text

def generate_summary(content: str, top_n: int=5) -> str:
    download('stopwords')
    stop_words = stopwords.words('english')
    summarize_text = []

    content = remove_unwanted_chars(content)
    
    # Get a list of sentences
    sentences =  get_sentences(content)
    
    # Generate Similary Martix across sentences
    # print(sentences)
    sentence_similarity_matrix = build_similarity_matrix(sentences, stop_words)
    # print(sentence_similarity_matrix)
    
    # Rank sentences in similarity martix using pagerank
    sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_matrix)
    # print(sentence_similarity_graph)
    scores = nx.pagerank(G=sentence_similarity_graph, max_iter=500)
    
    # Sort the sentences by rank and pick top sentences
    ranked_sentences = sorted(((scores[i],s) for i,s in enumerate(sentences)), reverse=True)
    
    num_sentences = len(ranked_sentences)
    if top_n > num_sentences:
        logging.info(f"There are only {num_sentences} sentences, which is less than summary length of {top_n} sentences. Returning sentences based on rank.")
        top_n = num_sentences
    
    logging.info(f"Summarizing {num_sentences} sentences with top {top_n} sentences.")
    for i in range(top_n):
        sentence = " ".join(ranked_sentences[i][1]).strip()
        summarize_text.append(sentence)

    summary = " ".join(summarize_text)
    return summary
