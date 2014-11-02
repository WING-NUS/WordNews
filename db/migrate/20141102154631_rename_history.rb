class RenameHistory < ActiveRecord::Migration
  def up
  	rename_column :histories, :meaning_id, :meanings_id
  end

  def down
  end
end
