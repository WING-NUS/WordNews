import os
import pickle

category_list = ["Technology", "Finance", "Entertainment", "Health", "World", "Travel", "Sports"]
strong_words = {}

current_category = ""
with open("FinalWords.txt") as f:
	for line in f:
		word = line.replace("\n", "")
		if word in category_list:
			strong_words[word] = []
			current_category = word
			continue

		strong_words[current_category].append(word)

print strong_words["Finance"]

file1 = open('strongwords.txt', 'w')
pickle.dump(strong_words, file1)
file1.close()



