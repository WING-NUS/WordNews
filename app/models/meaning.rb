class Meaning < ActiveRecord::Base
  attr_accessible :chinese_word_id, :english_word_id, :word_property, :word_category_id
  validates_uniqueness_of :chinese_word_id, :scope => :english_word_id
  belongs_to :chinese_word
  belongs_to :english_word
end
