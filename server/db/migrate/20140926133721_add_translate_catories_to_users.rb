class AddTranslateCatoriesToUsers < ActiveRecord::Migration
  def change
    add_column :users, :translate_categories, :string
  end
end
