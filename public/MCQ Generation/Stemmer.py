from nltk.stem import WordNetLemmatizer
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import wordnet

# using the snowball stemmer for the default
# using the wordnet stemmer for POS tagger with more accuracy

import sys

# The following function would map the treebank tags to WordNet part of speech names:
# citing from "http://stackoverflow.com/questions/15586721/wordnet-lemmatization-and-pos-tagging-in-python"

def get_wordnet_pos(treebank_tag):
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

word1 = sys.argv[1]

stemmer = SnowballStemmer("english")
print "Snowball: "+stemmer.stem(word1)

st = WordNetLemmatizer()
print "WordNet: "+ st.lemmatize(word1,wordnet.ADJ)
