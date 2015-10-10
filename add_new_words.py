"""
    Use this script to populate the database with the csv file specified in the program.
    Note that this script does not create the tables ... since the database was inherited from the existing app
    create them first, if needed
    After this is run, there is still a need to fill in the pinyin. The other script in the same repo, add_pinyin.py
    can be used as a starting point.
"""

import os
import csv
import psycopg2
import urlparse
import nltk
import pprint
import sqlite3

urlparse.uses_netloc.append("postgres")


database_to_use = 'postgres'
if (database_to_use == 'postgres'):
# obtain the details of the database and fill in here
# on heroku, this can be found by clicking on the database used
# from the app's page
    conn = psycopg2.connect(
        database="sdsd",
        user="asd",
        password="sddasd",
        host="asdasdasf",
        port=5432
    )
elif database_to_use == 'sqlite':
    conn = sqlite3.connect('dictionary.db')

cursor = conn.cursor()

rows_inserted = 0
rows_to_start_inserting = 0

with open('dictionary.csv', 'rb') as csvfile:

    reader = csv.reader(csvfile, delimiter=',')

    prev_word = None
    english_word_id = None
    for row in reader:
        try:
            word, chinese_translation, pos_tag = row
        except ValueError as e:
            print e
            print row

        word = word.lower()

        if word != prev_word:
            conn.commit()

            # first tuple of the word
            # this is the most common translation for the word. this informtion is still not encoded into the database
            if (database_to_use == 'postgres'):
                cursor.execute("INSERT INTO english_words VALUES(nextval('english_words_id_seq'), %s, current_timestamp, current_timestamp)", (word,))
                cursor.execute("SELECT id FROM english_words WHERE english_meaning=%s", (word,))
            elif (database_to_use == 'sqlite'):
                try:
                    cursor.execute("INSERT INTO english_words(english_meaning) VALUES(?)", (word,))
                except sqlite3.IntegrityError as e:
                    #
                    pass

                cursor.execute("SELECT id FROM english_words WHERE english_meaning=?", (word,))

            result = cursor.fetchone()
            english_word_id = result[0]

        if database_to_use == 'postgres':
            cursor.execute("SELECT id FROM chinese_words WHERE chinese_meaning=%s", (chinese_translation,))
            result = cursor.fetchone()
            if result is None or len(result) == 0:
                cursor.execute("INSERT INTO chinese_words VALUES(nextval('chinese_words_id_seq'), %s, current_timestamp, current_timestamp)", (chinese_translation,))
            cursor.execute("SELECT id FROM chinese_words WHERE chinese_meaning=%s", (chinese_translation,))

        elif database_to_use == 'sqlite':
            cursor.execute("SELECT id FROM chinese_words WHERE chinese_meaning=?", (chinese_translation.decode('utf-8'),))
            result = cursor.fetchone()

            if result is None or len(result) == 0:
                cursor.execute("INSERT INTO chinese_words(chinese_meaning) VALUES(?)", (chinese_translation.decode('utf-8'),))



            cursor.execute("SELECT id FROM chinese_words WHERE chinese_meaning=?", (chinese_translation.decode('utf-8'),))
        result = cursor.fetchone()
        chinese_word_id = result[0]

        category = 1  # noun
        if pos_tag == 'verb':
            category = 2
        elif pos_tag == 'preposition':
            category = 3
        elif pos_tag == 'adverb':
            category = 4
        elif pos_tag == 'adjective':
            category = 5
        elif pos_tag == 'prounoun':
            category = 6
        elif pos_tag == 'conjunction':
            category = 7

        if database_to_use == 'postgres':
            cursor.execute("INSERT INTO meanings VALUES(nextval('meanings_id_seq'), %s, %s, '', current_timestamp, current_timestamp, %s)", (chinese_word_id, english_word_id, category))

        elif database_to_use == 'sqlite':
            cursor.execute("INSERT INTO meanings(chinese_word_id, english_word_id, word_category_id) VALUES( ?, ?, ?)", (chinese_word_id, english_word_id, category))



        prev_word = word
    conn.commit()


