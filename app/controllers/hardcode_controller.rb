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
        flash[:notice] = "Translation was successfully created"
        format.html  { redirect_to(:controller => "hardcode", :action => "new") }
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
        flash[:notice] = "Quiz was successfully created"
        format.html  { redirect_to(:controller => "hardcode", :action => "newquiz") }
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
    @hardcoded_words = HardCodedWord.all
  end

  def delete
    @hardcoded_word = HardCodedWord.find(params[:id])
    @hardcoded_word.destroy
  end
  
  def viewquiz
    @hardcoded_quizzes = HardCodedQuiz.all
    
  end

  def deletequiz
    @hardcoded_quiz = HardCodedQuiz.find(params[:id])
    @hardcoded_quiz.destroy
  end
end
