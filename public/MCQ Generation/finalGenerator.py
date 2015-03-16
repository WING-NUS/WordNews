from MCQGenerator import MCQGenerator
from Baseline import WordGap
import sys

mc = MCQGenerator()
wg = WordGap()

category = "World"
understanding_level = 1 # there are 3 input levels for understanding
sentence = """I would have took my gun," he said. "I would have put it to Obama's head. I would have pulled the trigger."""
word = "pulled"

distractor_list = mc.get_distractors(category, understanding_level, word)
distractor_list2 = wg.get_distractors(word)

counter = 0
print distractor_list
print sentence.replace(word, "_____")
print "With my smart algorithm: "
for i in distractor_list:
	if counter == 0:
		print "A. "+i #[0]
		counter +=1
	elif counter == 1:
		print "B. "+i #[0]
		counter +=1
	elif counter == 2:
		print "C. "+i #[0]
		counter +=1
	else:
		print "D. "+i #[0]

print "With wordGap: "
for i in distractor_list2:
	if counter == 0:
		print "A. "+i #[0]
		counter +=1
	elif counter == 1:
		print "B. "+i #[0]
		counter +=1
	elif counter == 2:
		print "C. "+i #[0]
		counter +=1
	else:
		print "D. "+i #[0]