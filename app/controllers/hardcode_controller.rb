class HardcodeController < ApplicationController
  def new
    @translation = HardCodedWord.new
    respond_to do |format|
      format.html
    end
  end

  def add
    @translation = HardCodedWord.new
    

  end

  def view
  end

  def delete
  end
end
