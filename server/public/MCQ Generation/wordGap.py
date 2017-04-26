# prototype for WordGap System

import sys
from nltk.corpus import wordnet as wn
from collections import Counter

# target word is accepted through command line
target_word = sys.argv[1]
max_word = target_word
max_count = 0
for synset in wn.synsets(target_word):
	for i in synset.lemmas():
		print i.name()
		#print i.name() + " " + str(i.count())
		if i.count() > max_count and i.name() != target_word:
			max_word = i.name()
			max_count = i.count()

#print max_word + " : " + str(max_count)
# up to now we have the word where we want to choose distractors from
distractor_dict = {}
for synset in wn.synsets(max_word):
	for i in synset.lemmas():
		distractor_dict[i.name()] = i.count()

# the smart algorithm to select from a dictionary
result =  dict(Counter(distractor_dict).most_common(4))

# delete the word same as target word
final_list = []
counter = 0
for word in result:
	if word != target_word and counter < 3:
		final_list.append(word.replace('_', ' '))
		counter += 1
	if counter == 3:
		break
# print out the result to screen
print "\n\nHere are the distractors for this word:"
counter = 0
for i in final_list:
	if counter == 0:
		print "A. "+i
		counter +=1
	elif counter == 1:
		print "B. "+i
		counter +=1
	elif counter == 2:
		print "C. "+i

#print wn.synsets('motorcar').lemma_names()