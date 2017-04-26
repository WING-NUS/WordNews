from nltk.stem import WordNetLemmatizer
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import wordnet

# using the snowball stemmer for the default
# using the wordnet stemmer for POS tagger with more accuracy

import sys

class Stemmer(object):

# The following function would map the treebank tags to WordNet part of speech names:
# citing from "http://stackoverflow.com/questions/15586721/wordnet-lemmatization-and-pos-tagging-in-python"

    def __init__(self):
        self.stemmer = WordNetLemmatizer()

    def get_wordnet_pos(self, treebank_tag):
        if treebank_tag.startswith('J'):
            return wordnet.ADJ
        elif treebank_tag.startswith('V'):
            return wordnet.VERB
        elif treebank_tag.startswith('N'):
            return wordnet.NOUN
        elif treebank_tag.startswith('R'):
            return wordnet.ADV
        else:
            return ''

    def stem(self, word, pos_tag):
        wordnet_pos = self.get_wordnet_pos(pos_tag)
        return self.stemmer.lemmatize(word, wordnet_pos)

    
