class AddWordEnglishToSentences < ActiveRecord::Migration
  def change
    add_column :sentences, :word_english, :string
  end
end
