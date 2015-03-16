# prototype for WordGap System

import sys
from nltk.corpus import wordnet as wn
from collections import Counter


class WordGap(object):

	def get_distractors(self, target_word):
		max_word = target_word
		max_count = 0
		# get all synsets of this word, and find the synset with max lemma
		for synset in wn.synsets(target_word):
			for i in synset.lemmas():
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

		return final_list