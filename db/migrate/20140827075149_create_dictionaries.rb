class CreateDictionaries < ActiveRecord::Migration
  def change
    create_table :dictionaries do |t|
      t.string :word_english
      t.string :word_chinese
      t.string :word_category
      t.integer :word_difficulty_id

      t.timestamps
    end
  end
end
