class CreateWordCategories < ActiveRecord::Migration
  def change
    create_table :word_categories do |t|
      t.string :category_name

      t.timestamps
    end
  end
end
