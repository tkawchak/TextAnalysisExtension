// <copyright file="Converters.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProcessTextFunc.Utils
{
    using System;
    using ProcessTextFunc.Contracts;

    public static class Converters
    {
        public static ProcessedText ConvertProcessTextRequestToProcessedTextDocument(ProcessTextRequest request)
        {
            var processedText = new ProcessedText
            {
                Id = request.Title,
                Author = request.Author,
                AutomatedReadabilityIndex = request.AutomatedReadabilityIndex,
                AverageSentenceLength = request.AverageSentenceLength,
                ColemanLiauIndex = request.ColemanLiauIndex,
                Content = request.Content,
                DaleChallReadabilityScore = request.DaleChallReadabilityScore,
                DatePublished = request.DatePublished,
                DifficultWords = request.DifficultWords,
                Domain = request.Domain,
                Excerpt = request.Excerpt,
                FleschKincaidGrade = request.FleschKincaidGrade,
                FleshEase = request.FleshEase,
                GunningFoxIndex = request.GunningFoxIndex,
                LeadImageUrl = request.LeadImageUrl,
                LexiconCount = request.LexiconCount,
                LinsearWriteIndex = request.LinsearWriteIndex,
                LixReadabilityIndex = request.LixReadabilityIndex,
                OverallScore = request.OverallScore,
                ProcessedTime = DateTime.UtcNow,
                SentenceCount = request.SentenceCount,
                SmogIndex = request.SmogIndex,
                SyllableCount = request.SyllableCount,
                Title = request.Title,
                Url = request.Url,
            };
            return processedText;
        }

        public static GetTextResponse ConvertProcessedTextDocumentToGetTextResponse(ProcessedText document)
        {
            var getTextResponse = new GetTextResponse
            {
                Author = document.Author,
                AutomatedReadabilityIndex = document.AutomatedReadabilityIndex,
                AverageSentenceLength = document.AverageSentenceLength,
                ColemanLiauIndex = document.ColemanLiauIndex,
                Content = document.Content,
                DaleChallReadabilityScore = document.DaleChallReadabilityScore,
                DatePublished = document.DatePublished,
                DifficultWords = document.DifficultWords,
                Domain = document.Domain,
                Excerpt = document.Excerpt,
                FleschKincaidGrade = document.FleschKincaidGrade,
                FleshEase = document.FleshEase,
                GunningFoxIndex = document.GunningFoxIndex,
                LeadImageUrl = document.LeadImageUrl,
                LexiconCount = document.LexiconCount,
                LinsearWriteIndex = document.LinsearWriteIndex,
                LixReadabilityIndex = document.LixReadabilityIndex,
                OverallScore = document.OverallScore,
                ProcessedTime = document.ProcessedTime,
                SentenceCount = document.SentenceCount,
                SmogIndex = document.SmogIndex,
                SyllableCount = document.SyllableCount,
                Title = document.Title,
                Url = document.Url,
            };
            return getTextResponse;
        }
    }
}
