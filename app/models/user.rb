class User < ActiveRecord::Base
  attr_accessible :user_id, :user_name
  validates :user_id, uniqueness: true
  validates :user_name, uniqueness: true
  has_many :understands
  has_many :not_understands
  has_many :dictionaries, through: :understands
  has_many :dictionaries, through: :not_understands
end
