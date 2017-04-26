class AddWordIdToDictionaries < ActiveRecord::Migration
  def change
    add_column :dictionaries, :word_id, :integer
  end
end
