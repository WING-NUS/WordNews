class Transaction < ActiveRecord::Base
  attr_accessible :if_remembered, :transcation_code, :url, :user_name, :word_english
end
