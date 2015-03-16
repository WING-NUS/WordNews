import pickle
import csv

file1 = open('news_data4.txt', 'r')
dict1 = pickle.load(file1)

# write to csv file
category_list = ["Technology", "Travel", "Sports", "Finance", "Entertainment", "World", "Health"]
with open("dict3.csv", 'wb') as file:
	a = csv.writer(file)
	for category in category_list:
		for tag in dict1[category]:
			print category + " " + tag + " " + str(len(dict1[category][tag]))
			#continue
			# using .keys() can modify the dict keys without error
			for word in dict1[category][tag].keys():
				print "Processing word " + word + " in category " + category
				entry = []
				entry.append(category)
				entry.append(tag)
				entry.append(word)
				entry.append(str(dict1[category][tag][word]))
				a.writerow(entry)
# news_data2 eliminate those words containing non-alphabetic character
# if all(c.isalpha() for c in word) == False:
#					del dict1[category][tag][word]
#					continue
# news_data3 change it to all lower case
#if word.islower() == True:
#					continue
#				else:
#					dict1[category][tag][word.lower()] = dict1[category][tag].pop(word)
#					continue

#file1 = open('news_data3.txt', 'w')
#pickle.dump(dict1, file1)
#file1.close()