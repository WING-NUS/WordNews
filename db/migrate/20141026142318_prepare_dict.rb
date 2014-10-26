class PrepareDict < ActiveRecord::Migration
  def change
    create_table :chinese_words do |t|
      t.string :chinese_meaning
      t.timestamps
    end
 
    create_table :english_words do |t|
      t.string :english_meaning
      t.timestamps
    end
 
    create_table :meanings do |t|
      t.belongs_to :chinese_word
      t.belongs_to :english_word
      t.string :word_property
      t.timestamps 
    end
  end
end
