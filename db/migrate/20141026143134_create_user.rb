class CreateUser < ActiveRecord::Migration
  def change
  	create_table :users do |t|
      t.string :user_name
      t.integer :if_translate
      t.string :translate_categories
      t.timestamps
    end

    create_table :histories do |t|
      t.belongs_to :user
      t.belongs_to :english_word
      t.integer  :frequency
      t.string   :url 
      t.timestamps 
    end
  end

  def down

  end
end
