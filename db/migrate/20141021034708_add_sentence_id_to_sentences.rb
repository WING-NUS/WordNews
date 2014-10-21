class AddSentenceIdToSentences < ActiveRecord::Migration
  def change
    add_column :sentences, :sentence_id, :integer
  end
end
