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
		file1 = open('./public/MCQ Generation/news_data4.txt', 'r')
		file2 = open('./public/MCQ Generation/strongwords.txt', 'r')
		self.super_dict = pickle.load(file1)
		self.strong_dict = pickle.load(file2)
		self.stemmer = Stemmer()

	# return the correct POS tag information
	def get_target_tag(self, input_sentence, input_word):
		text = nltk.word_tokenize(input_sentence) # the standard pos tagger
		pos_result =  nltk.pos_tag(text)
		for i in pos_result:
			if i[0] == input_word:
				return i[1]

	# return 10 words with good similarity to caller
	def get_similarity(self, category, word, tag, number):
		similar_list = []
		word1 = self.stemmer.stem(word, tag)
		word_list = self.super_dict[category][tag].keys()
		random.shuffle(word_list)
		

		for candidate in word_list:
			word2 = self.stemmer.stem(candidate, tag)
			calculator = WordDistance()
			distance = calculator.get_distance(word1, word2)
			#print "Distance is: " + str(distance) + " " + candidate + " " + word

			# JJ is weird for distance program
			if tag == "JJ":
				if distance == 1:
					similar_list.append(candidate)
					# print "inside here: " + candidate
					if len(similar_list) > number-1:
						return similar_list
			else:
				if distance > 0.1 and distance < 1: # eliminate in the same synsets
					similar_list.append(candidate)
					# print "inside here: " + candidate
					if len(similar_list) > number-1:
						return similar_list

		return similar_list

	def get_distractors(self, category, sentence,understanding_level, word):
		# get the correct pos tag
		target_tag = self.get_target_tag(sentence, word)
		#print target_tag
		# if understanding level is 1, just simply return 3 words from the category
		if understanding_level == 1:
			distractors_list = random.sample(self.super_dict[category][target_tag].keys(),3)
			distractors_list.append(word)
			return distractors_list
		elif understanding_level == 2:
			distractors_list = random.sample(self.super_dict[category][target_tag].keys(),2)
			#print "Is it here?"
			similar_list = self.get_similarity(category, word, target_tag, 1)
			distractors_list.append(word)
			return distractors_list + similar_list
		elif understanding_level == 3:
			similar_list = self.get_similarity(category, word, target_tag, 3)
			similar_list.append(word)
			return similar_list

	def get_distractors(self, category, understanding_level, word):
		distractors_list = []
		#print "Tag is: "
		tag = self.get_target_tag(word, word)

		#print "haha1"
		#for cate in self.strong_dict:
			#print cate

		shuffle(self.strong_dict[category])

		for dict_word in self.strong_dict[category]:
			similarity_score = self.get_similarity(dict_word, word, tag)
		#	print "Lin Distance is ", similarity_score
			if self.get_target_tag(dict_word, dict_word) == tag and dict_word != word and  similarity_score> 0:
				distractors_list.append(dict_word)
			if len(distractors_list) >=3:
				break

		#print "Haha"
		#print distractors_list
		distractors_list.append(word)
		return distractors_list

	def get_similarity(self, word1, word2, tag):
		#word1 = self.stemmer.stem(word1, tag)
		#word2 = self.stemmer.stem(word2, tag)
		calculator = WordDistance()
		distance = calculator.get_lin_distance(word1, word2)
		return distance



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('category')
    parser.add_argument('knowledge_level', type=int)
    parser.add_argument('token')

    args = parser.parse_args()
  
    generator = MCQGenerator()
    result = generator.get_distractors(args.category, args.knowledge_level, args.token)
    print ", ".join(result)
