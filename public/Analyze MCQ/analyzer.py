import csv
import time
from collections import defaultdict

# get baseline distractors list # in correct order
baseline = {}
row_number = 1
filename = "baseline.csv"
with open(filename,'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		baseline[row_number] = []
		for word in row:
			baseline[row_number].append(word)
		row_number += 1

# print baseline

# get level 1 stuff
level1 = {}
row_number = 1
filename = "level1.csv"
with open(filename,'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		level1[row_number] = []
		for word in row:
			level1[row_number].append(word)
		row_number += 1
# print level1

# get level 3 stuff
level3 = {}
row_number = 1
filename = "level3.csv"
with open(filename,'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		level3[row_number] = []
		for word in row:
			level3[row_number].append(word)
		row_number += 1
# print level3
###################

filename = "reply2.csv"

columns = {}
key_list = []
for i in range(1,51):
	key_list.append(str(i))
print key_list

column_to_qn = {}
row_number = 1
with open(filename, 'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		if row_number == 1:
			for index,v in enumerate(row):
				column_to_qn[index]=v
			row_number += 1
			continue
		for index,value in enumerate(row):
			column_name = column_to_qn[index]

			k_name = column_name.split(" ")[0].replace(".", "")

			if k_name not in columns and k_name in key_list:
				columns[k_name] = []
			if k_name in key_list:
				print k_name,"in row number", row_number
				if value != "":
					columns[k_name].append(value)
			row_number += 1

print len(columns)
#print columns['3']
#time.sleep(1000000)
#print columns['17']
for i in columns:
	if i in key_list:
		print len(columns[i]), "in Question", i

#time.sleep(10000000)
# get the mapping

mappings = {}

filename = "reply2_dist.csv"
row_number = 26
with open(filename, 'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		mappings[row_number] = []
		for word in row:
			mappings[row_number].append(word)
		row_number+=1

print mappings
# time.sleep(1000000)


# calculate score
score = {}
score["baseline"] = {}
score["mine"] = {}
print "hahaha"
#print columns['25']
for qn_no in columns:
	score["baseline"][qn_no] = 0
	score["mine"][qn_no] = 0
	length = len(columns[qn_no])
	divider = 0
	if length%7 == 0:
		divider = 7
	else:
		divider = 6
	print columns[qn_no]
	print qn_no
	print "divider is", divider
	print len(columns[qn_no])
	for idx, val in enumerate(columns[qn_no]):
		print "index is", idx
		word = mappings[int(qn_no)][idx%divider]
		if word in baseline[int(qn_no)]:
			score["baseline"][qn_no] += int(val)
		if word in level1[int(qn_no)]:
			score["mine"][qn_no] += int(val)

counter = 1
for q in score["baseline"]:
	print "Question", q, ":", score["baseline"][q], ",",score["mine"][q]
	if score["baseline"][q] > score["mine"][q]: # mine wins
		counter += 1
print counter
print score






		