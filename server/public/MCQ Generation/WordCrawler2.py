import urllib2, re, logging, psycopg2, time, random, os,csv
from bs4 import BeautifulSoup
import json as simplejson
from nltk.corpus import words
import os.path

cache = {}
current_category = ""
line_counter = 0
with open("input_url2.txt") as f:
	for line in f:
		line_counter += 1
		print "Processing line #"+str(line_counter)
		if "http" not in line:
			current_category = line
			cache[current_category]=[]
			continue
		else:
			url = line
			con = urllib2.urlopen(url, timeout=60)
			html = con.read()
			soup = BeautifulSoup(html)
			page = soup.findAll('p')#.getText()
			cache[current_category].append(page)
print "finished reading"

word_data = {}
for category in cache:
	for web in cache[category]:
		for i in web:
			word_list = i.getText().split(" ")
			for word in word_list:
				real_word = re.sub('[^a-zA-Z]','',word)
				print category + "..checking.."+ real_word
				#if real_word not in words.words() or real_word == "":
				if real_word == "":
					continue
				if real_word not in word_data:
					word_data[real_word] = {}
				if category not in word_data[real_word]:
					word_data[real_word][category] = 0
				else:
					word_data[real_word][category] += 1

# write to csv file

with open("result.csv", 'wb') as file:
	a = csv.writer(file)
	for word in word_data:
		entry = []
		entry.append(word)
		for i in word_data[word]:
			element = i+": " + str(word_data[word][i])
			entry.append(element)
		a.writerow(entry)

	