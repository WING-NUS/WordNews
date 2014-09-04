#!bin/env ruby
#encoding: utf-8

class TranslatesController < ApplicationController
  # GET /translates
  # GET /translates.json
  def index
    @translates = Translate.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @translates }
    end
  end
  
  #def translate(english_line)
   # buildDictionary
    #word_list = english_line.split(" ")
    #puts word_list
    #result = {}
    #for word in word_list
     # if $englishToChinese.has_key?(word)
      #  result[word] = $englishToChinese[word]
      #end
    #end
    #return result.to_s
  #end

  # GET /translates/1
  # GET /translates/1.json
  def show
    #@translate = Translate.find(params[:id])
    @text=Hash.new
    #@text[:english] = params[:text]
    #@text[:chinese] = translate(@text[:english].clone) # so we keep @text[:english unchanged]
    word_list=params[:text].split(" ")

    for word in word_list
      temp=Dictionary.where(:word_english => word).first
      if temp.blank?
        next
      else
        @text[word]= temp.word_chinese
      end
    end
    #@text[:english].gsub 'morning', '早上好'
  end
  # GET /translates/new
  # GET /translates/new.json

  def remember 
    @user_name = params[:name]
    @word = params[:word]
    @ifRemember = params[:is_remembered].to_i

    @word_id = Dictionary.where(:word_english => @word).first.word_id
    user = User.where(:user_name => @user_name).first
    if user.blank? #no user
      newUser = User.new
      newUser.user_name = @user_name
      user_id = Random.rand(1000000)
      test_exist = User.where(:user_id => user_id).first
      newUser.user_id = user_id
      newUser.save
    end


    @user_id = User.where(:user_name => @user_name).first.user_id
    testEntry = Understand.where(:word_id => @word_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      testEntry.if_understand = @ifRemember
      testEntry.save
    else # this is a new word the user has some operations on
      understand = Understand.new
      understand.user_id = @user_id
      understand.word_id = @word_id
      understand.strength = 4
      understand.if_understand = @ifRemember>0?1:0
      understand.save
    end
  end

  def new
    @translate = Translate.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @translate }
    end
  end

  # GET /translates/1/edit
  def edit
    @translate = Translate.find(params[:id])
  end

  def calculate
    @user_name = params[:name]
    @number = Hash.new
    user = User.where(:user_name => @user_name).first
    if user.blank? #no user
      @number['learnt']=0
      @number['tolearn']=0
    else
      @user_id = user.user_id
      @querylearnt = "user_id=" + @user_id.to_s+ "and if_understand=1"
      @querytolearn = "user_id=" + @user_id.to_s+ "and if_understand=0"
      @number['learnt']=Understand.count('user_id', :conditions => [@querylearnt])
      @number['tolearn']=Understand.count('user_id', :conditions => [@querytolearn])
    end
  end

  # POST /translates
  # POST /translates.json
  def create
    @translate = Translate.new(params[:translate])

    respond_to do |format|
      if @translate.save
        format.html { redirect_to @translate, notice: 'Translate was successfully created.' }
        format.json { render json: @translate, status: :created, location: @translate }
      else
        format.html { render action: "new" }
        format.json { render json: @translate.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /translates/1
  # PUT /translates/1.json
  def update
    @translate = Translate.find(params[:id])

    respond_to do |format|
      if @translate.update_attributes(params[:translate])
        format.html { redirect_to @translate, notice: 'Translate was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @translate.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /translates/1
  # DELETE /translates/1.json
  def destroy
    @translate = Translate.find(params[:id])
    @translate.destroy

    respond_to do |format|
      format.html { redirect_to translates_url }
      format.json { head :no_content }
    end
  end
end
