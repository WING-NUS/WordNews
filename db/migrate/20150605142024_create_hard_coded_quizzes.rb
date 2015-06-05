class CreateHardCodedQuizzes < ActiveRecord::Migration
  def change
    create_table :hard_coded_quizzes do |t|
      t.string :url
      t.string :word
      t.string :option1
      t.string :option2
      t.string :option3

      t.timestamps
    end
  end
end
