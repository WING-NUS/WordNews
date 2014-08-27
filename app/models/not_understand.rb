class NotUnderstand < ActiveRecord::Base
  attr_accessible :strength, :user_id, :word_id
  validates_uniqueness_of :user_id, :scope => :word_id
  belongs_to :user
  belongs_to :dictionary
end
