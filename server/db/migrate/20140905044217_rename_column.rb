class RenameColumn < ActiveRecord::Migration
  def up
  	rename_column :transactions, :transcation_code, :transaction_code
  end

  def down
  end
end
