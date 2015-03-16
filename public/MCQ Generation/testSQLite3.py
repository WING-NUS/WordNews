# create table before run netcraft parser

import sqlite3

db = sqlite3.connect('MCQ.db')
db.execute('''CREATE TABLE IF NOT EXISTS url
      (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      URL           TEXT KEY UNIQUE NOT NULL,
      CATEGORY       CHAR(50),
      UPDATE_TIME        DATE);''')
print "table created successfully"
db.close()