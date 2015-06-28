class HardCodedWord < ActiveRecord::Base
  before_save lstrip_slash
  attr_accessible :translation, :url, :word
  def lstrip_slash
    self.url = self.url.chomp '/'
  end
end
