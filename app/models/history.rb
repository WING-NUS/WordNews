class History < ActiveRecord::Base
  attr_accessible :user_id, :meaning_id, :frequency, :url
  validates_uniqueness_of :user_id, :scope => :meaning_id
end
