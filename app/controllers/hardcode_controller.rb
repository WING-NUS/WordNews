class HardcodeController < ApplicationController
  def new
    @translation = HardCodedWord.new
    respond_to do |format|
      format.html
    end
  end

  def add
    @translation = HardCodedWord.new(params[:hard_coded_word])
    respond_to do |format|
      if @translation.save
        format.html  { redirect_to(:controller => "hardcode", :action => "new",
                    :notice => 'translation was successfully created.') }
        format.json  { render :json => @translation,
                    :status => :created, :location => @translation }
      else
        format.html  { render :action => "new" }
        format.json  { render :json => @translation.errors,
                    :status => :unprocessable_entity }
      end
    end
  end

  def newquiz
    @quiz = HardCodedQuiz.new
    respond_to do |format|
      format.html
    end
  end

  def addquiz
    @quiz = HardCodedQuiz.new(params[:hard_coded_quiz])
    respond_to do |format|
      if @quiz.save
        format.html  { redirect_to(:controller => "hardcode", :action => "quiznew",
                    :notice => 'translation was successfully created.') }
        format.json  { render :json => @quiz,
                    :status => :created, :location => @quiz }
      else
        format.html  { render :action => "new" }
        format.json  { render :json => @quiz.errors,
                    :status => :unprocessable_entity }
      end
    end
  end

  def view
  end

  def delete
  end
  
  def viewquiz
  end

  def deletequiz
  end
end
