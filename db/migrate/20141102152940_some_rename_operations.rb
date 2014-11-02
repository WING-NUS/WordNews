class SomeRenameOperations < ActiveRecord::Migration
  def up
  	rename_table :english_words_example_sentences, :meanings_example_sentences
  	rename_column :meanings, :english_word_id, :english_words_id
  	rename_column :meanings, :chinese_word_id, :chinese_words_id
  	rename_column :histories, :user_id, :users_id
  end

  def down
  	
  end
end
