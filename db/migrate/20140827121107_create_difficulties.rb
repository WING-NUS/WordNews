class CreateDifficulties < ActiveRecord::Migration
  def change
    create_table :difficulties do |t|
      t.integer :word_difficulty_id
      t.string :word_difficulty_string

      t.timestamps
    end
  end
end
