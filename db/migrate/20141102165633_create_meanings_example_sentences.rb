class CreateMeaningsExampleSentences < ActiveRecord::Migration
  def change
    create_table :meanings_example_sentences do |t|
      t.integer :meanings_id
      t.integer :example_sentences_id

      t.timestamps
    end
  end
end
