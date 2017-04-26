class CreateHardCodedWords < ActiveRecord::Migration
  def change
    create_table :hard_coded_words do |t|
      t.string :url
      t.string :word
      t.string :translation

      t.timestamps
    end
  end
end
