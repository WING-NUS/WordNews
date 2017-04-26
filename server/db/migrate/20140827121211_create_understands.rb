class CreateUnderstands < ActiveRecord::Migration
  def change
    create_table :understands do |t|
      t.integer :user_id
      t.integer :word_id
      t.integer :strength

      t.timestamps
    end
  end
end
