class EnglishWords < ActiveRecord::Base
  attr_accessible :english_meaning
  validates :english_meaning, uniqueness: true
  has_many :meanings, :dependent => :destroy
  has_many :chinese_words, :through => :meaning
end
