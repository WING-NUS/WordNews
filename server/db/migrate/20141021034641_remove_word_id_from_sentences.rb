class RemoveWordIdFromSentences < ActiveRecord::Migration
  def up
    remove_column :sentences, :word_id
      end

  def down
    add_column :sentences, :word_id, :integer
  end
end
