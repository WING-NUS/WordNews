# test word distance 

import sys
from nltk.corpus import wordnet as wn
from nltk.corpus import wordnet_ic

brown_ic = wordnet_ic.ic('ic-brown.dat')


word1 = sys.argv[1]
word2 = sys.argv[2]

print "In word 1:"
for i in wn.synsets(word1):
	print i

print "In word 2:"
for i in wn.synsets(word2):
	print i

target1 = wn.synsets(word1)[0]
target2 = wn.synsets(word2)[0]

print "The two targets are:"
print target1
print target2

try:
	print target1.lin_similarity(target2, brown_ic)
except:
	print "0" 
