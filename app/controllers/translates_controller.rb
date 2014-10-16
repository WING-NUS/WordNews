#!bin/env ruby
#encoding: utf-8

class TranslatesController < ApplicationController
  # GET /translates
  # GET /translates.json
  include Bing
  
  def index
    @translates = Translate.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @translates }
    end
  end

  # GET /translates/1
  # GET /translates/1.json
  def show
    #@translate = Translate.find(params[:id])
    @text=Hash.new
    word_list=params[:text].split(" ")
    chinese_sentence = Bing.translate(params[:text].to_s,"en","zh-CHS")
    puts chinese_sentence
    @user_name = params[:name]
    user = User.where(:user_name => @user_name).first
    @url = params[:url]
    category_list = user.translate_categories.split(",")
    for word in word_list
      #this is to add downcase and singularize support
      original_word = word.downcase.singularize
      temp=Dictionary.where(:word_english => original_word, :word_category => category_list ).first
      if temp.blank?
        next
      else
        @text[word]= Hash.new
        original_word_chinese = temp.word_chinese
        @user_id = User.where(:user_name => @user_name).first.user_id
        # see if the user understands this word before
        ifExist = Understand.where(:user_id => @user_id, :word_id => temp.word_id).first
        @text[word]['chinese']=temp.word_chinese
        @text[word]['pronunciation']=temp.pronunciation
        if ifExist.blank? or ifExist.if_understand <= 3  #just translate the word
          @text[word]['is_test']=0
        elsif ifExist.if_understand > 3 and ifExist.if_understand < 7 #testing mah
          @text[word]['is_test']=1
          @text[word]['choices']=Hash.new
          choices = Dictionary.where(:word_category => category_list).where("word_english != ?", original_word).random(3)
          choices.each_with_index { |val, idx|   
            @text[word]['choices'][idx.to_s]=val.word_english
          }
        elsif ifExist.if_understand > 6 and ifExist.if_understand < 10
          @text[word]['is_test']=2
          @text[word]['choices']=Hash.new
          choices = Dictionary.where(:word_category => category_list).where("word_chinese != ?", original_word_chinese).random(3)
          choices.each_with_index { |val, idx|   
            @text[word]['choices'][idx.to_s]=val.word_english
          }
        end
        @log = Transaction.new
        @log.transaction_code = 103
        @log.user_name = @user_name
        @log.word_english = word
        @log.url = @url
        @log.save
      end
    end # end of for word in word_list

    respond_to do |format|
      format.html { render :layout => false }# new.html.erb
      format.json { render json: @translate }
    end
  end


  # GET /translates/new
  # GET /translates/new.json

  def remember 
    @user_name = params[:name]
    @word = params[:word].downcase.singularize
    @ifRemember = params[:is_remembered].to_i
    @url = params[:url]
    @log = Transaction.new
    @log.transaction_code = 101
    @log.user_name = @user_name
    @log.if_remembered = @ifRemember
    @log.word_english = @word
    @log.url = @url
    @log.save

    @word_id= Dictionary.where(:word_english => @word).first.word_id
    user = User.where(:user_name => @user_name).first
    @user_id = User.where(:user_name => @user_name).first.user_id
    testEntry = Understand.where(:word_id => @word_id, :user_id => @user_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      if @ifRemember == 0
        testEntry.if_understand = @ifRemember
      else 
        testEntry.if_understand = testEntry.if_understand+1
      testEntry.url = @url
      testEntry.save
      end
    else # this is a new word the user has some operations on
      understand = Understand.new
      understand.user_id = @user_id
      understand.word_id = @word_id
      understand.strength = 4
      understand.url = @url
      understand.if_understand = @ifRemember
      understand.save
    end
    respond_to do |format|
      format.html { render :layout => false }# new.html.erb
      format.json { render json: @translate }
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
      newUser = User.new
      newUser.user_name = @user_name
      user_id = Random.rand(1000000)
      newUser.user_id = user_id
      newUser.if_translate = 1
      newUser.translate_categories = "1,2,3,4" # the default will be translate all
      newUser.save
    end
    @log = Transaction.new
    @log.transaction_code = 201
    @log.user_name = @user_name
    #@log.url = @url
    @log.save
    if user.blank? #no user
      @number['learnt']=0
      @number['tolearn']=0
    else
      @user_id = user.user_id
      @querylearnt = "user_id=" + @user_id.to_s+ " and if_understand >0"
      @querytolearn = "user_id=" + @user_id.to_s+ " and if_understand=0"
      @number['learnt']=Understand.count('user_id', :conditions => [@querylearnt])
      @number['tolearn']=Understand.count('user_id', :conditions => [@querytolearn])
    end

    respond_to do |format|
      format.html { render :layout => false }# new.html.erb
      format.json { render json: @translate }
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
