import os
import psycopg2
import urlparse
import nltk
import pprint

urlparse.uses_netloc.append("postgres")

conn = psycopg2.connect(
    database="",
    user="",
    password="",
    host="",
    port=0
)

cursor = conn.cursor()
stopwords = nltk.corpus.stopwords.words('english')

for stopword in stopwords:
    print "removing " + stopword
    cursor.execute("DELETE FROM english_words WHERE english_meaning='" + stopword + "'")

# clear all meanings that does not have an entry in english_words
cursor.execute("DELETE FROM meanings WHERE english_words_id NOT IN (SELECT id FROM english_words)")

# clear all chinese words that does not have an entry in meanings
cursor.execute("DELETE FROM chinese_words WHERE id NOT IN (SELECT chinese_words_id FROM meanings)")

conn.commit()


