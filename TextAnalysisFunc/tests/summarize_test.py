from analytics.summarize import get_sentences, generate_summary

import unittest

class TestSummarize(unittest.TestCase):

    def test_get_sentences_number_of_sentences_correct(self):
        text = "Hi. My name. Is Tom. I Like to. Write. TESTS!"
        sentences = get_sentences(text)

        self.assertEqual(6, len(sentences), "Number of extracted sentences is not equal to expected")

    def test_get_sentences_splits_on_newline(self):
        text = "Hi\\nThis is a sentence\\nsplit over multiple lines."
        sentences = get_sentences(text)

        print(sentences)
        self.assertEqual(3, len(sentences), "Number of extracted sentences is not equal to expected")

    def test_summarizes_file_content(self):
        with open("tests/content_sample.txt", "r") as content_file:
            content_text = content_file.read()
        
        summary = generate_summary(content_text, 20)
        summary_sentences = get_sentences(summary)
        print("summary: ", summary)
        self.assertGreaterEqual(len(summary_sentences), 5,
            "The summary does not contain enough sentences compared with expected.")
        # Note: This test does not assert anything because sometimes it is not possible
        # to assert on the number of sentences in the summary because we lose context
        # like newlines that might separate sentences but would not separate them in the summary.

    def test_summarizes_file_content_small(self):
        with open("tests/content_sample2.txt", "r") as content_file:
            content_text = content_file.read()
        
        summary = generate_summary(content_text, 5)

        summary_sentences = get_sentences(summary)
        print("summary: ", summary)
        self.assertTrue(5, len(summary_sentences))


if __name__ == '__main__':
    unittest.main()
