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
		with open(file_name) as f:
			for line in f:
				line = line.replace("\n", "").decode('utf-8').encode('utf-8')
				word_list = line.split(" ")
				for word in word_list:
					if word not in dictionary_data[category]:
						dictionary_data[category][word] = 1
					else:
						dictionary_data[category][word] +=1

				#print "Finished processing " + word + " in " + category


average_weight = {}		
for category in dictionary_data:
	no_words = len(dictionary_data[category])
	#print "Length of " + category + " is " + str(len(dictionary_data[category]))
	count = 0
	for word in dictionary_data[category]:
		count += dictionary_data[category][word]
	average_weight[category] = count*1.0/no_words
	#print "Counts in " + category + " is " + str(count)


#print average_weight

# now filter
satisfied_words = {}

target_category = "World"
for word in dictionary_data[target_category]:
	try: 
		if dictionary_data[target_category][word] > average_weight[target_category]+ 5:
			print word
	except:
		continue


"""
for category in dictionary_data:
	count = 0
	print category
	for word in dictionary_data[category]:
		if dictionary_data[category][word] > average_weight[category]+ 20:
			print word
			count +=1
	satisfied_words[category] = count

print "HAHAHAHAHAHAHA\n\n"
print satisfied_words
"""

#print dictionary_data
#file1 = open('news_data_count_1.txt', 'w')
#pickle.dump(dictionary_data, file1)
#file1.close()



# Delete the entries from news_data4 for those low-weighted items
"""
file1 = open('news_data4.txt', 'r')
super_dict = pickle.load(file1)

for category in super_dict:
	for tag in super_dict[category]:
		for word in super_dict[category][tag]:
			print word
"""
#