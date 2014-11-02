class ExampleSentence < ActiveRecord::Base
  attr_accessible :english_sentence, :chinese_sentence
  has_many :meanings_example_sentences, :dependent => :destroy
end
