class CreateEnglishWordsExampleSentences < ActiveRecord::Migration
  def change
    create_table :english_words_example_sentences do |t|
      t.belongs_to :english_word
      t.belongs_to :example_sentence
      t.timestamps
    end
  end
end
