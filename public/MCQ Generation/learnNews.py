import csv, time, sys
import random
from collections import Counter
# randome is used to 


filename = "result_final.csv"
confidence_factor = 1



target_word = sys.argv[1]

word_data = {}
with open(filename, 'rU') as f:
	reader = csv.reader(f)
	for row in reader:
		if row[0] == "Category":
			continue
		word_data[row[0]]={}
		word_data[row[0]]["Technology"] = row[1]
		word_data[row[0]]["Travel"] = row[2]
		word_data[row[0]]["Sports"] = row[3]
		word_data[row[0]]["Finance"] = row[4]
		word_data[row[0]]["Entertainment"] = row[5]
		word_data[row[0]]["World"] = row[6]
		word_data[row[0]]["Fashion"] = row[7]
		word_data[row[0]]["Health"] = row[8]

#print word_data


#time.sleep(100000)
category_data = {}
category_data["Technology"] = {}
category_data["Travel"] = {}
category_data["Sports"] = {}
category_data["Finance"] = {}
category_data["Entertainment"] = {}
category_data["World"] = {}
category_data["Fashion"] = {}
category_data["Health"] = {}

for word in word_data:
	weight_sum = 0
	for category in word_data[word]:
		weight_sum += int(word_data[word][category])
	average_sum = weight_sum/8.0
	#print average_sum
	for category in word_data[word]:
		if float(word_data[word][category]) > average_sum + confidence_factor:
			category_data[category][word] = word_data[word][category]

#print category_data 
#time.sleep(10000)
# write to csv file

category_list = ["Technology", "Travel", "Sports", "Finance", "Entertainment", "World", "Fashion", "Health"]

target_category = ""
highest_count = 0
for category in category_list:
	if target_word in category_data[category]:
		if category_data[category][target_word] > highest_count:
			target_category = category
			highest_count = category_data[category][target_word]
if target_category == "":
	target_category = "Technology"
	print "Uncategorized"
else:
	print target_category

# up to now we have the target category of words already

#result =  dict(Counter(category_data[target_category]).most_common(1))
#for i in result:
#	print i

print "\n\nHere are the distractors for this word:"
result = random.sample( category_data[target_category].items(), 3)

counter = 0
for i in result:
	if counter == 0:
		print "A. "+i[0]
		counter +=1
	elif counter == 1:
		print "B. "+i[0]
		counter +=1
	elif counter == 2:
		print "C. "+i[0]













