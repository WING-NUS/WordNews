class History < ActiveRecord::Base
  attr_accessible :user_id, :meaning_id, :frequency, :url
end
