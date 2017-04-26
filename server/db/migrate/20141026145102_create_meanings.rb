class CreateMeanings < ActiveRecord::Migration
  def change
    create_table :meanings do |t|
      t.belongs_to :chinese_word
      t.belongs_to :english_word
      t.string :word_property
      t.timestamps 
    end
  end
end
