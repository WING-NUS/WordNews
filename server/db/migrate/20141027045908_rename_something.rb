class RenameSomething < ActiveRecord::Migration
  def self.up
    rename_column :histories, :english_word_id, :meaning_id
  end

  def down
  end
end
