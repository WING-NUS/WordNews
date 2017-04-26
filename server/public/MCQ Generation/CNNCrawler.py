# this one is the crawler of CNN
# First step I will try to crawl all the weblinks of the specific page

import sys
from bs4 import BeautifulSoup
import json as simplejson
import urllib2
import sqlite3
import datetime


# BaseURL stores the based page for each
BaseURL = {}
# BaseURL["Technology"] = "http://www.cnn.com/tech"  # Tech news front page
BaseURL["Finance"] = "http://www.bbc.com/news/business"
# BaseURL["Entertainment"] = "http://www.cnn.com/entertainment"
# BaseURL["Sports"] = "http://bleacherreport.com" # "http://edition.cnn.com/sport"
#BaseURL["Health"] = "http://www.cnn.com/health" 
# BaseURL["World"] = "http://www.cnn.com/world"
#BaseURL["Travel"] = "http://www.cnn.com/travel"

CategoryIdentifier = {}
CategoryIdentifier["Technology"] = "/tech"
CategoryIdentifier["Finance"] = "/news/business"
CategoryIdentifier["Entertainment"] = "/entertainment"
CategoryIdentifier["Sports"] = "ort"
CategoryIdentifier["Health"] = "/health"
CategoryIdentifier["Travel"] = "/travel"
CategoryIdentifier["World"] = "/world"

# Some identifier of news content:
# /tech shall present in tech news url
# /travel
# /entertainment
# money.cnn
# bleacherreport
# /health

#db = sqlite3.connect('MCQ.db')
global_counter = 0
update_time = datetime.datetime.now()
for category in BaseURL:
	print category
	target_url = BaseURL[category]
	try:
		con = urllib2.urlopen(target_url, timeout=60)
	except:
		continue
	# print "Processing URL: " + target_url
	html = con.read()
	soup = BeautifulSoup(html)
	# get all link urls inside the page
	page = soup.findAll('a')#.getText()
	# print page
	counter = 0
	for i in page:
		#print type(i)
		# print i
		#print i and ("2014" or "2015") in i['href'] 
		if CategoryIdentifier[category] in i['href'] and "videos" not in i["href"]:
			url_to_insert = i['href']
			if "http" not in url_to_insert:
				url_to_insert = "http://www.bbc.com" + url_to_insert
			print url_to_insert
			#try:
			#	with db:
			#		db.execute('''INSERT INTO url (url, category, update_time) VALUES(?,?,?)''', (url_to_insert, category,update_time))
			#except:
			#	print "Insertion to database failed"
			counter += 1
			global_counter += 1
	# print str(counter) + "printed!!"
print global_counter, "is printed"
	#print page

# db.close()
