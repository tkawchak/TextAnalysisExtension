// <copyright file="ProcessedText.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProcessTextFunc.Contracts
{
    using System;
    using Newtonsoft.Json;

    [Serializable]
    public class ProcessedText
    {
        [JsonProperty("author")]
        public string Author { get; set; }

        [JsonProperty("automated_readability_index")]
        public float AutomatedReadabilityIndex { get; set; }

        [JsonProperty("average_sentence_length")]
        public float AverageSentenceLength { get; set; }

        [JsonProperty("coleman_liau_index")]
        public float ColemanLiauIndex { get; set; }

        [JsonProperty("content")]
        public string Content { get; set; }

        [JsonProperty("dale_chall_readability_score")]
        public float DaleChallReadabilityScore { get; set; }

        [JsonProperty("date_published")]
        public DateTime DatePublished { get; set; }

        [JsonProperty("difficult_words")]
        public int DifficultWords { get; set; }

        [JsonProperty("domain")]
        public string Domain { get; set; }

        [JsonProperty("excerpt")]
        public string Excerpt { get; set; }

        [JsonProperty("flesch_ease")]
        public float FleshEase { get; set; }

        [JsonProperty("fleschkincaid_grade")]
        public float FleschKincaidGrade { get; set; }

        [JsonProperty("gunning_fog_index")]
        public float GunningFoxIndex { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("lead_image_url")]
        public string LeadImageUrl { get; set; }

        [JsonProperty("lexicon_count")]
        public int LexiconCount { get; set; }

        [JsonProperty("linsear_write_index")]
        public float LinsearWriteIndex { get; set; }

        [JsonProperty("lix_readability_index")]
        public float LixReadabilityIndex { get; set; }

        [JsonProperty("overall_score")]
        public string OverallScore { get; set; }

        [JsonProperty("processed_time")]
        public DateTime ProcessedTime { get; set; }

        [JsonProperty("sentence_count")]
        public int SentenceCount { get; set; }

        [JsonProperty("smog_index")]
        public float SmogIndex { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("syllable_count")]
        public int SyllableCount { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }
    }
}