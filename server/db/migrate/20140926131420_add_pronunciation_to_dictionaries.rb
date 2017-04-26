class AddPronunciationToDictionaries < ActiveRecord::Migration
  def change
    add_column :dictionaries, :pronunciation, :string
  end
end
