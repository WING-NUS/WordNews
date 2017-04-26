class DropNotUnderstandsTable < ActiveRecord::Migration
  def up
  	drop_table :not_understands
  end

  def down

  end
end
