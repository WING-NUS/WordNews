class WordCategory < ActiveRecord::Base
  attr_accessible :category_name
  validates :category_name, uniqueness: true
end
