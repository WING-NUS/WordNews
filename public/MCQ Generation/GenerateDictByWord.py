import pickle
import csv

file1 = open('news_data_by_word.txt', 'r')
dict1 = pickle.load(file1)

word_dict = {}
# write to csv file
"""
category_list = ["Technology", "Travel", "Sports", "Finance", "Entertainment", "World", "Health"]
for category in category_list:
	for tag in dict1[category]:
		# using .keys() can modify the dict keys without error
		for word in dict1[category][tag].keys():
			#print "Processing word " + word + " in category " + category
			if word not in word_dict:
				word_dict[word] = {}
			else:
				if category not in word_dict[word]:
					word_dict[word][category] = {}
				else:
					word_dict[word][category][tag] = dict1[category][tag][word]
			continue

file1 = open('news_data_by_word.txt', 'w')
pickle.dump(word_dict, file1)
file1.close()

"""
with open("dict3_by_word.csv", 'wb') as file:
	a = csv.writer(file)
	for word in dict1:
		print word
		entry = []
		entry.append(word)
		for category in dict1[word]:
			for tag in dict1[word][category]:
				cell = category + " " + tag + " " + str(dict1[word][category][tag])
				entry.append(cell)
		a.writerow(entry)

# print word_dict
# news_data2 eliminate those words containing non-alphabetic character
# if all(c.isalpha() for c in word) == False:
#					del dict1[category][tag][word]
#					continue
# news_data3 change it to all xlower case
#if word.islower() == True:
#					continue
#				else:
#					dict1[category][tag][word.lower()] = dict1[category][tag].pop(word)
#
# 					continue
# news_data4 change to a store with word as key
# if word not in word_dict:
#					word_dict[word] = {}
#				elif category not in word_dict[word]:
#					word_dict[word][category] = {}
#				elif tag not in word_dict[word][category]:
#					word_dict[word][category][tag] = dict1[category][tag][word]
#				else:
#					word_dict[word][category][tag] = dict1[category][tag][word]
#				continue
#file1 = open('news_data4_by_word.txt', 'w')
#pickle.dump(dict1, file1)
#file1.close()