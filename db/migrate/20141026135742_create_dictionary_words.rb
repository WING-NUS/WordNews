class CreateDictionaryWords < ActiveRecord::Migration
  def change
    create_table :dictionary_words do |t|
      t.integer :chinese_words_id
      t.integer :english_words_id
      t.string :word_property
      t.timestamps
    end
  end
end
