class CreateHistories < ActiveRecord::Migration
  def change
    create_table :histories do |t|
      t.belongs_to :user
      t.belongs_to :english_word
      t.integer  :frequency
      t.string   :url 
      t.timestamps 
    end
  end
end
