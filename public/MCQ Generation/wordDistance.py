# test word distance 

import sys
from nltk.corpus import wordnet as wn

# accept two words from command line
word1 = sys.argv[1]
word2 = sys.argv[2]



max_frequent = 0
current_synset = ""
for synset in wn.synsets(word1):
	freq = 0
	for lemma in synset.lemmas():
		freq += lemma.count()
	if freq > max_frequent:
		current_synset = synset
target1 =  current_synset

print target1

max_frequent = 0
for synset in wn.synsets(word2):
	freq = 0
	for lemma in synset.lemmas():
		freq += lemma.count()
	if freq > max_frequent:
		current_synset = synset
target2 =  current_synset

print target2

print wn.path_similarity(target1, target2)