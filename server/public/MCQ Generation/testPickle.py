import pickle

dict1 = {'one' : 1, 'two' : 2 }
file1 = open('dict.txt', 'w')
pickle.dump(dict1, file1)
file1.close()