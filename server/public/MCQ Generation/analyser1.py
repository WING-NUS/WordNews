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
from WordDistanceCalculator import WordDistances
from WordNetStemmer import Stemmer


def get_wordnet_pos(treebank_tag):

    if treebank_tag.startswith('J'):
        return "ADJ"
    elif treebank_tag.startswith('V'):
        return "VERB"
    elif treebank_tag.startswith('N'):
        return "NOUN"
    elif treebank_tag.startswith('R'):
        return "ADV"
    else:
        return ""

# all the categories we need to take care of
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
		print "Processing file: " + file_name
		with open(file_name) as f:
			for line in f:
				line = line.replace("\n", "").decode('utf-8').encode('utf-8')
				try:
					text = nltk.word_tokenize(line) # the standard pos tagger
					pos_result =  nltk.pos_tag(text)
				except UnicodeDecodeError:
					continue
				for i in pos_result:
					word_form = get_wordnet_pos(i[1])
					if word_form != "":
						#print i[0] + " after stemming: " + stemmer.stem(i[0], i[1])
						if i[1] not in dictionary_data[category]:
							dictionary_data[category][i[1]] = {}
						if i[0] not in dictionary_data[category][i[1]]:
							dictionary_data[category][i[1]][i[0]] = 1
						else:
							dictionary_data[category][i[1]][i[0]] += 1

print dictionary_data
file1 = open('news_data.txt', 'w')
pickle.dump(dictionary_data, file1)
file1.close()

print "writing to file succeed!"

time.sleep(10000)

# can use calculator to calculate distance between two word, using base form!!!!
calculator = WordDistance()
print calculator.get_distance("believe", "kiss")


target_sentence = "The animals are having lunch"
target_word = "animals"
target_tag = ""

text = nltk.word_tokenize(target_sentence)
pos_result = nltk.pos_tag(text)
for i in pos_result:
	if i[0]== target_word:
		target_tag = i[1]

# print out the count in each word
for category in category_list:
	if target_tag in dictionary_data[category]:
		if target_word in dictionary_data[category][target_tag]:
			print category + " : " + str(dictionary_data[category][target_tag][target_word])



