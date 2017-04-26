class AddIfUnderstandToUnderstands < ActiveRecord::Migration
  def change
    add_column :understands, :if_understand, :integer
  end
end
