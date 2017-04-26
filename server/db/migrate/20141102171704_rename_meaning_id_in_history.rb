class RenameMeaningIdInHistory < ActiveRecord::Migration
  def up
  	rename_column :histories, :meanings_id, :meaning_id
  end

  def down
  end
end
