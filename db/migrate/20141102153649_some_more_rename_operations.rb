class SomeMoreRenameOperations < ActiveRecord::Migration
  def up
  	rename_column :meanings_example_sentences, :english_word_id, :meanings_id
  	rename_column :meanings_example_sentences, :example_sentence_id, :example_sentences_id
  end

  def down
  	
  end
end
