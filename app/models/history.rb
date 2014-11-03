class History < ActiveRecord::Base
  attr_accessible :user_id, :meanings_id, :frequency, :url
  validates_uniqueness_of :user_id, :scope => :meaning_id
  belongs_to :users
  belongs_to :meanings
end
