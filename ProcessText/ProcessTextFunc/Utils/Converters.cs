using System;
using ProcessTextFunc.Contracts;

namespace ProcessTextFunc.Utils
{
    public static class Converters
    {
        public static ProcessedText ConvertProcessTextRequestToProcessedTextDocument(ProcessTextRequest request)
        {
            var processedText = new ProcessedText {
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
                Title = request.Title
            };
            return processedText;
        }
    }
}