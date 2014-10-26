class CreateExampleSentences < ActiveRecord::Migration
  def change
    create_table :example_sentences do |t|
      t.string :english_sentence
      t.string :chinese_sentence
      t.timestamps
    end
  end
end
