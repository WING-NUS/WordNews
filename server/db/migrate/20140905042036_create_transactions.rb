class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.integer :transcation_code
      t.string :user_name
      t.integer :word_english
      t.integer :if_remembered
      t.string :url

      t.timestamps
    end
  end
end
