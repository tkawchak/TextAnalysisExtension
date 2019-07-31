using System;

namespace ProcessTextFunc.Models
{
    public class TextExtractionResponse
    {
        public string Title;
        public string Content;
        public string Author;
        public string DatePublished;
        public string LeadImageUrl;
        public string Dek;
        public string NextPageUrl;
        public string Url;
        public string Domain;
        public string Excerpt;
        public int WordCount;
        public string Direction;
        public int TotalPages;
        public int RenderedPages;
    }
}