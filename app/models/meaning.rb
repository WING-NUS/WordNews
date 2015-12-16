class Meaning < ActiveRecord::Base
  attr_accessible :chinese_words_id, :english_words_id, :word_property, :word_category_id
  validates_uniqueness_of :chinese_words_id, :scope => :english_word_id
  has_many :meanings_example_sentences, :dependent => :destroy
  has_many :histories, :dependent => :destroy
  belongs_to :chinese_words
  belongs_to :english_words
end
