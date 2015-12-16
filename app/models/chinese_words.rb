class ChineseWords < ActiveRecord::Base
  attr_accessible :chinese_meaning
  validates :chinese_meaning, uniqueness: true
  has_many :meanings, :dependent => :destroy
  has_many :english_words, :through => :meanings
end
