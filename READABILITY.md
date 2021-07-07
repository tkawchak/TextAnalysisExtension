# Readability Scores
Readability scores compute how difficult it is to comprehend a piece of text. Some compute a grade level of education that is needed to understand the text and some compute a score.

Often the best way to "improve" these readability scores by making text more readable is to use shorter sentences and shorter words. Most of the formulas were developed for the english language so applying them to other languages does not really make sense.

## Flesch-Kincaid Readability
There are two [Flesch-Kincaid Readability Tests](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) and both can be used to score text readability.
### Flesch Reading-Ease
This score ranges from 0 (very difficult to read) to 100 (very easy to read). It is computed with the following formula. 
```
206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
```
This score is affected more by words with many syllables.

### Flesh-Kincaid Grade
This is used more extensively for education, as it computes an estimated grade level. It is computed with the following formula.
```
0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
```
This grade level emphasizes sentence length over word length.

## Gunning Fog Index
The [Gunning Fog Index](https://en.wikipedia.org/wiki/Gunning_fog_index) estimates the number of years of education someone needs to have in order to understand text on the first reading. So, a score of 12 means that an average person who graduated high school should be able to understand the text after reading it once. Per the [wikipedia entry on the gunning fog index](https://en.wikipedia.org/wiki/Gunning_fog_index), "Texts for a wide audience generally need a fog index less than 12. Texts requiring near-universal understanding generally need an index less than 8."

It is computed by the following formula, where "complex words" are words with 3 or more syllables.
```
0.4 * ((words / sentences) + 100 * (complex words / words))
```
To reduce this score, use less complex words with fewer syllables because they will be easier to understand.

## SMOG Index
The [Simple Measure for Gobbledygook (SMOG) Index](https://en.wikipedia.org/wiki/SMOG) estimates the number of years of education needed in order to understand some text. It is computed by the following formula, where again "complex words" are words with 3 or more syllables.
```
1.0430  * sqrt((complex words) * (30 / sentences) + 3.1219)
```
For this formula to be valid, there must be at least 30 sentences of text because the formula was normalized on 30-sentence samples.

## Coleman-Liau Index
The [Coleman-Liau Index](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index) approximates US grade level of education needed to comprehend some text. It relies on the number of characters per word to calculate the text. It is calculated by the following formula
```
0.0588 * L - 0.296 * S - 15.8
```
Where L is the average number of letters per 100 words and S is the average number of sentences per 100 words.

## Dale-Chall Readability Formula
The [Dale-Chall Readability Formula](https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula) provides a number that indicates comprehension difficulty for readers. It is computed with the formula
```
0.1579 * (difficult words / words * 100) + 0.0496 * (words / sentences)
```
where difficult words are words that are not in a standard set of 3000 words that are supposed to be easily understood with people with a 4th grade level of education.

## Linsear Write Index
The [Linsear Write Index](https://en.wikipedia.org/wiki/Linsear_Write) is designed to calculate the grade level needed to read a text sample fluently by adding up the words in a text sample of 100 words
```
r = (simple words + 3 * complex words) / words
if r > 20:
    LW = r/2
if r <= 20:
    LW = r/2-1
```
where complex words are words with 3 or more syllables.

## Lix Readability Test
The [Lix Readability Test](https://en.wikipedia.org/wiki/Lix_(readability_test)) indicates the difficulty of reading a text. It is computed by the following formula
```
(words / periods) + (complex words * 100 / words)
```
where periods can be either "." (period), ";" (semicolon), or the first capital letter of text.