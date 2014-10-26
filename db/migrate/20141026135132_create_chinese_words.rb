class CreateChineseWords < ActiveRecord::Migration
  def change
    create_table :chinese_words do |t|
      t.string :chinese_words

      t.timestamps
    end
  end
end
