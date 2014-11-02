class History < ActiveRecord::Base
  attr_accessible :users_id, :meanings_id, :frequency, :url
  validates_uniqueness_of :users_id, :scope => :meaning_id
  belongs_to :users
  belongs_to :meanings
end
