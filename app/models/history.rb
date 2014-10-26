class History < ActiveRecord::Base
  attr_accessible :user_id, :english_word_id, :frequency, :url
 
end
