class AddQuizTypeToHardCodedQuiz < ActiveRecord::Migration
  def change
    add_column :hard_coded_quizzes, :quiz_type, :integer
  end
end
