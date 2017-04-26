class AddIfTranslateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :if_translate, :integer
  end
end
