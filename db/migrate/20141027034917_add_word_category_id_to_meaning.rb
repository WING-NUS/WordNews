class AddWordCategoryIdToMeaning < ActiveRecord::Migration
  def change
    add_column :meanings, :word_category_id, :integer
  end
end
