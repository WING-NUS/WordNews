import csv
import time
from Baseline import WordGap
from MCQGenerator import MCQGenerator

sentence_filename = "sampleSentence.txt"
word_filename = "EvaluationInput.txt"

word_list = []
category_list = []
mappings = {}
 
with open(word_filename, 'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		if row[1] != "":
			word_list.append(row[1])

line_counter = 0

with open(sentence_filename) as f:
	for row in f:
		if row != "\n":
			print row.replace(word_list[line_counter], "______")
			#print word_list[line_counter]
			line_counter += 1
			

print "There are ", line_counter, " lines in this file"