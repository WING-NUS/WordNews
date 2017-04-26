# test word distance 

import sys
from nltk.corpus import wordnet as wn
from nltk.corpus import wordnet_ic


# Return a score denoting how similar two word senses are
# based on the shortest path that connects the senses in the is-a (hypernym/hypnoym) taxonomy. 

class WordDistance(object):

    def get_distance(self, word1, word2):   

        max_frequent = 0
        current_synset = ""
        for synset in wn.synsets(word1):
            freq = 0
            for lemma in synset.lemmas():
                freq += lemma.count()
            if freq > max_frequent:
                current_synset = synset
        target1 =  current_synset
        
        max_frequent = 0
        for synset in wn.synsets(word2):
            freq = 0
            for lemma in synset.lemmas():
                freq += lemma.count()
            if freq > max_frequent:
                current_synset = synset
        target2 =  current_synset
        
        return wn.path_similarity(target1, target2)

    def get_lin_distance(self, word1, word2):
        brown_ic = wordnet_ic.ic('ic-brown.dat')
        if len(wn.synsets(word1)) == 0 or len(wn.synsets(word2)) == 0:
            return 0

        target1 = wn.synsets(word1)[0]
        target2 = wn.synsets(word2)[0]

        try:
            result = target1.lin_similarity(target2, brown_ic)
            return result
        except:
            return 0
