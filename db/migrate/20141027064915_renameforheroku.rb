class Renameforheroku < ActiveRecord::Migration
  def self.up
    rename_column :english_words, :english_words, :english_meaning
    rename_column :chinese_words, :chinese_words, :chinese_meaning
  end

  def down
  end
end
