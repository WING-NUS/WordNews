import string

s = "some\x00string. with\x15 \0xc3 funny characters"
print s
filter(lambda x: x in string.printable, s)
print s