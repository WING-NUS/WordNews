class HardCodedWord < ActiveRecord::Base
  before_save :rstrip_slash
  attr_accessible :translation, :url, :word
  protected
    def rstrip_slash
      self.url = self.url.chomp '/'
    end
end
