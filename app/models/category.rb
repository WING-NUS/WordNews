class Category < ActiveRecord::Base
  attr_accessible :category_id, :name

  belongs_to :dictionary
end
