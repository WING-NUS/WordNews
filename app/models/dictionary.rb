class Dictionary < ActiveRecord::Base
  attr_accessible :word_category, :word_chinese, :word_difficulty_id, :word_english, :word_id
  validates :word_id, uniqueness: true
  has_many :understands
  has_many :not_understands
  has_many :difficulties
  has_many :users, through: :understands
  has_many :users, through: :not_understands
end
