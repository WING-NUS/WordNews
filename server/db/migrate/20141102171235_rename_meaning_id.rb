class RenameMeaningId < ActiveRecord::Migration
  def up
  	rename_column :meanings_example_sentences, :meanings_id, :meaning_id
  end

  def down
  end
end
