class AddPronunciationToChineseWords < ActiveRecord::Migration
  def change
    add_column :chinese_words, :pronunciation, :string
  end
end
