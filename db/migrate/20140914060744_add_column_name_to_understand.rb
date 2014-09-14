class AddColumnNameToUnderstand < ActiveRecord::Migration
  def change
    add_column :understands, :url, :string
  end
end
