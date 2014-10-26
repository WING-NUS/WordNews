class User < ActiveRecord::Base
  attr_accessible :user_name, :if_translate, :translate_categories
  validates :user_name, uniqueness: true
  #has_many :understands, dependent: :destroy
  #has_many :dictionaries, through: :understands
end
