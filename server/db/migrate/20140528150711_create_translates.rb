class CreateTranslates < ActiveRecord::Migration
  def change
    create_table :translates do |t|

      t.timestamps
    end
  end
end
