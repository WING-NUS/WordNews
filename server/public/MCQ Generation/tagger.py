import nltk

content = "Obamama is a good man"
text = nltk.word_tokenize(content)
print nltk.pos_tag(text)