import urllib2, re, logging, time, random, os,csv
from bs4 import BeautifulSoup
import json as simplejson
from nltk.corpus import stopwords
import os.path

current_category = ""
line_counter = 3000
category_list = ["Technology", "Entertainment", "Finance", "Travel", "Health", "World", "Sports"]
with open("input_url6.txt") as f:
	for line in f:
		if line.replace("\n", "") in category_list:
			print "Processing in category: " + line.replace("\n", "")
			current_category = line.replace("\n","")
			continue
		else:
			url = ""
			#if "http" not in line:
			#	if current_category == "Finance":
			#		url = "http://money.cnn.com"+ line
			#		continue
			#	else:
			#		url = "http://www.cnn.com" + line
			#else: 
			url = line
			line_counter += 1
			print "Processing line #"+str(line_counter) + " in " + current_category
			try:
				con = urllib2.urlopen(url, timeout=60)
			except:
				print "open URL failed"
				continue
			html = con.read()
			soup = BeautifulSoup(html)
			page = soup.findAll('p')#.getText()
			f = open("Corpus/"+current_category+"/"+ current_category +  str(line_counter)+'.txt','w')
			for i in page:
				sentence = i.getText()
				f.write(sentence.encode('utf-8') + "\n")
			f.close() 

	