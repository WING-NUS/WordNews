import csv
import time
from Baseline import WordGap
from MCQGenerator import MCQGenerator

filename = "EvaluationInput.txt"

word_list = []
category_list = []
mappings = {}
 
with open(filename, 'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		if row[1] != "":
			word_list.append(row[1])
			category_list.append(row[2])
			mappings[row[1]] = row[2]

print len(word_list)
print mappings

#time.sleep(10000)
# generate based on base line

base = WordGap()
mine = MCQGenerator()
for word in word_list:
	print word
	print base.get_distractors(word)

output_filename = "mine_level3.csv"
with open(output_filename, 'w') as fp:
    a = csv.writer(fp, delimiter=',')
    for word in word_list:
    	line = []
    	line.append(word)
    	line = line + mine.get_distractors(mappings[word],3,word)
    	a.writerow(line)