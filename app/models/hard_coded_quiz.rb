class HardCodedQuiz < ActiveRecord::Base
  attr_accessible :option1, :option2, :option3, :url, :word, :quiz_type
end
