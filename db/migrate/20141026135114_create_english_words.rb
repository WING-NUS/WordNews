class CreateEnglishWords < ActiveRecord::Migration
  def change
    create_table :english_words do |t|
      t.string :english_words

      t.timestamps
    end
  end
end
