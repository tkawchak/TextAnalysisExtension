from analytics.summarize import get_sentences

import unittest

class TestSummarize(unittest.TestCase):

    def test_get_sentences(self):
        text = "Hi. My name. Is Tom. I Like to. Write. TESTS!"
        sentences = get_sentences(text)

        self.assertEqual(6, len(sentences), "Number of extracted sentences is not equal to expected")

if __name__ == '__main__':
    unittest.main()