class AddPropertyToDictionary < ActiveRecord::Migration
  def change
    add_column :dictionaries, :property, :string
  end
end
