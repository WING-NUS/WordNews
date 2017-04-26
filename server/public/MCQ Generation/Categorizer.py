import pickle
import urllib2, re, logging, time, random, os,csv
from bs4 import BeautifulSoup
import json as simplejson
import nltk
from nltk.corpus import stopwords
import os.path
from os import listdir
import glob
import string
import pickle
import time
from WordDistanceCalculator import WordDistance
from WordNetStemmer import Stemmer

# categorize on a very big basis

class Categorizer(object):

	def categorize(self):

		# the system supports current categories
		category_list = ["Technology", "Entertainment", "Finance", "Travel", "Health", "World", "Sports"]

		dictionary_data = {}
		dictionary_data["Technology"] = {}
		dictionary_data["Entertainment"] = {}
		dictionary_data["Finance"] = {}
		dictionary_data["Travel"] = {}
		dictionary_data["Health"] = {}
		dictionary_data["World"] = {}
		dictionary_data["Sports"] = {}

		# my magic two stemmer and distance calculator
		calculator = WordDistance()
		stemmer = Stemmer()

		# read through all the articles in each folder
		for category in category_list:
			file_list = glob.glob("Corpus/"+category+"/*.txt")
			# begin to read file one by one
			for file_name in file_list:
				#print "Processing file: " + file_name
				words_in_this_file = []
				with open(file_name) as f:
					for line in f:
						line = line.replace("\n", "").decode('utf-8').encode('utf-8')
						word_list = line.split(" ")
						for raw_word in word_list:
							# remove all non word and change them to 
							word = re.sub("[^A-Za-z]", "", raw_word).lower()
							# we are calculating frequency per document
							if word in words_in_this_file:
								continue
							if word not in dictionary_data[category]:
								dictionary_data[category][word] = 1
							else:
								dictionary_data[category][word] +=1
							words_in_this_file.append(word) # append this word to this document's word list

				#print "Finished processing " + word + " in " + category


		# calculating average weight for each word
		weight_sum = {}
		for category in dictionary_data:
			for word in dictionary_data[category]:
				if word not in weight_sum:
					weight_sum[word] = 0
				else:
					weight_sum[word] += dictionary_data[category][word]
		average_weight = {}
		for word in weight_sum:
			average_weight[word] = weight_sum[word] * 1.0 / 7

		# getting the words whose weight is above the average weight, by using 5 it should be around 10
		satisfied_words = {}
		for target_category in category_list:
			satisfied_words[target_category] = []
			for word in dictionary_data[target_category]:
				try: 
					if dictionary_data[target_category][word] > average_weight[word]+ 5:
						satisfied_words[target_category].append(word)
				except:
					continue

		# to be add. eliminate those non-words

		# store the result into a local dictionary
		print dictionary_data
		file1 = open('news_data_count_1.txt', 'w')
		pickle.dump(dictionary_data, file1)
		file1.close()
