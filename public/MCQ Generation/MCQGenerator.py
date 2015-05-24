import pickle
import argparse
import csv
import nltk
import random

from random import shuffle
from collections import Counter
from WordDistanceCalculator import WordDistance
from WordNetStemmer import Stemmer

nltk.data.path.append('./public/MCQ Generation/nltk_data')

class MCQGenerator(object):

	def __init__(self):
            try:
                with open('./public/MCQ Generation/news_data4.txt', 'r') as file1, open('./public/MCQ Generation/strongwords.txt', 'r') as file2:
		    self.super_dict = pickle.load(file1)
		    self.strong_dict = pickle.load(file2)
		self.stemmer = Stemmer()
		self.calculator = WordDistance()
            except IOError as e:
                print "[Error in MCQGenerator: while opening files]"

	# return the correct POS tag information
	def get_target_tag(self, input_sentence, input_word):
		text = nltk.word_tokenize(input_sentence) # the standard pos tagger
		pos_result =  nltk.pos_tag(text)
		for i in pos_result:
			if i[0] == input_word:
				return i[1]

	def get_similarity(self, category, word, tag, number):
                """ Return the specified number of words with good similarity"""
		similar_list = []
		word1 = self.stemmer.stem(word, tag)
		word_list = self.super_dict[category][tag].keys()
		calculator = WordDistance()

                while len(similar_list) <= number - 1:
                        candidate = random.choice(word_list)

			word2 = self.stemmer.stem(candidate, tag)
			distance = calculator.get_distance(word1, word2)

			# JJ is weird for distance program
			if tag == "JJ":
				if distance == 1:
					similar_list.append(candidate)
			else:
				if distance > 0.1 and distance < 1: # eliminate in the same synsets
					similar_list.append(candidate)

		return similar_list

	def get_distractors(self, category, sentence,understanding_level, word):
		# get the correct pos tag
		target_tag = self.get_target_tag(sentence, word)
		if understanding_level == 1:
			distractors_list = random.sample(self.super_dict[category][target_tag].keys(), 3)
			distractors_list.append(word)
			return distractors_list
		elif understanding_level == 2:
			distractors_list = random.sample(self.super_dict[category][target_tag].keys(), 2)
			
			similar_list = self.get_similarity(category, word, target_tag, 1)
			distractors_list.append(word)
			return distractors_list + similar_list
		elif understanding_level == 3:
			similar_list = self.get_similarity(category, word, target_tag, 3)
			similar_list.append(word)
			return similar_list

	def get_distractors(self, category, understanding_level, word):
		distractors_list = []
		
		tag = self.get_target_tag(word, word)

                for x in xrange(1, 200):
                        try: 
                            distractor = random.choice(self.strong_dict[category])
                        except KeyError as e:
                            # no distractors avaliable TODO!
                            break
	
			if self.get_target_tag(distractor, distractor) == tag and distractor != word:
				if self.get_similarity(distractor, word, tag) > 0 :
  				    distractors_list.append(distractor)
			if len(distractors_list) >= 3:
				break

		distractors_list.append(word)
		return distractors_list

	def get_similarity(self, word1, word2, tag):
		distance = self.calculator.get_lin_distance(word1, word2)
		return distance



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('category')
    parser.add_argument('knowledge_level', type=int)
    parser.add_argument('token')

    args = parser.parse_args()
    try: 
        generator = MCQGenerator()
        result = generator.get_distractors(args.category, args.knowledge_level, args.token)
    except Exception as e:
        print "Error in MCQGenerator!"
        print e
    
    print ", ".join(result)
