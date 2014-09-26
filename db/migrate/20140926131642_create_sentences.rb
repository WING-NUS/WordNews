class CreateSentences < ActiveRecord::Migration
  def change
    create_table :sentences do |t|
      t.integer :word_id
      t.text :english_sentence
      t.text :chinese_sentence

      t.timestamps
    end
  end
end
