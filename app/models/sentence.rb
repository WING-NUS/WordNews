class Sentence < ActiveRecord::Base
  attr_accessible :chinese_sentence, :english_sentence, :word_id

  belongs_to :dictionary
end
