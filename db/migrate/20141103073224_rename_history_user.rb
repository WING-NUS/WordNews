class RenameHistoryUser < ActiveRecord::Migration
  def up
  	rename_column :histories, :users_id, :user_id
  end

  def down
  end
end
