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
BaseURL["Technology"] = "http://www.cnn.com/tech"  # Tech news front page
#BaseURL["Finance"] = "http://money.cnn.com"
BaseURL["Entertainment"] = "http://www.cnn.com/entertainment"
BaseURL["Sports"] = "http://bleacherreport.com"
BaseURL["Health"] = "http://www.cnn.com/health" 
BaseURL["World"] = "http://www.cnn.com/world"
BaseURL["Travel"] = "http://www.cnn.com/travel"

CategoryIdentifier = {}
CategoryIdentifier["Technology"] = "/tech"
CategoryIdentifier["Finance"] = "money.cnn"
CategoryIdentifier["Entertainment"] = "/entertainment"
CategoryIdentifier["Sports"] = "bleacherreport"
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

db = sqlite3.connect('MCQ.db')
update_time = datetime.datetime.now()
for category in BaseURL:
	target_url = BaseURL[category]
	try:
		con = urllib2.urlopen(target_url, timeout=60)
	except:
		continue
	print "Processing URL: " + target_url
	html = con.read()
	soup = BeautifulSoup(html)
	# get all link urls inside the page
	page = soup.findAll('a')#.getText()
	print page
	counter = 0
	for i in page:
		print i
		if CategoryIdentifier[category] in i['href'] and ("2014" or "2015") in i['href'] and "videos" not in i["href"]:
			url_to_insert = i['href']
			if "http" not in url_to_insert:
				url_to_insert = "http://www.cnn.com" + url_to_insert
			print url_to_insert
			try:
				with db:
					db.execute('''INSERT INTO url (url, category, update_time) VALUES(?,?,?)''', (url_to_insert, category,update_time))
			except:
				print "Insertion to database failed"
			counter += 1
	print str(counter) + " URLs are saved into db already"
	#print page

db.close()
