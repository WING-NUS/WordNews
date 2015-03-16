import urllib2, re, logging, time, random, os,csv
from bs4 import BeautifulSoup
import json as simplejson
from nltk.corpus import stopwords
import os.path

cache = {}
current_category = ""
line_counter = 0
with open("input_url.txt") as f:
	for line in f:
		line_counter += 1
		print "Processing line #"+str(line_counter)
		if "http" not in line:
			current_category = line.replace("\n","")
			cache[current_category]=[]
			continue
		else:
			url = line
			try:
				con = urllib2.urlopen(url, timeout=60)
			except:
				continue
			html = con.read()
			soup = BeautifulSoup(html)
			page = soup.findAll('p')#.getText()
			cache[current_category].append(page)
print "finished reading"

word_data = {}
for category in cache:
	for web in cache[category]:
		words_in_document = []
		for i in web:
			word_list = i.getText().split(" ")
			for word in word_list:
				real_word = re.sub('[^a-zA-Z\']','',word).lower()
				if real_word not in words_in_document:
					words_in_document.append(real_word)
				else:
					continue
				#real_word  = word.lower()
				print category + "..checking.."+ real_word
				#if real_word not in words.words() or real_word == "":
				if real_word == "" or real_word in stopwords.words("english") or "'" in real_word:
					continue
				if real_word not in word_data:
					word_data[real_word] = {}
				if category not in word_data[real_word]:
					word_data[real_word][category] = 0
				word_data[real_word][category] += 1

# write to csv file
category_list = ["Technology", "Travel", "Sports", "Finance", "Entertainment", "World", "Fashion", "Health"]
with open("result_final.csv", 'wb') as file:
	a = csv.writer(file)
	firstrow = ["Category"]
	for i in category_list:
		firstrow.append(i)
	a.writerow(firstrow)
	for word in word_data:
		entry = []
		entry.append(word)
		for i in category_list:
			element = ""
			if i in word_data[word]:
				element = word_data[word][i]
			else:
				element = 0
			entry.append(element)
		a.writerow(entry)

	