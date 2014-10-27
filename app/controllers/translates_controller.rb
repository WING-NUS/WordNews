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
    #chinese_sentence = Bing.translate(params[:text].to_s,"en","zh-CHS")
    chinese_sentence = "我到了"
    #puts chinese_sentence
    @user_name = params[:name]
    user = User.where(:user_name => @user_name).first
    @url = params[:url]
    category_list = user.translate_categories.split(",")
    for word in word_list
      #this is to add downcase and singularize support
      original_word = word.downcase.singularize
      english_word_entry = EnglishWords.where(:english_meaning => original_word)
      if english_word_entry.length == 0
        next
      else
        @original_word_id = english_word_entry.first.id
      end

      meanings = Meaning.where(:english_word_id => @original_word_id, :word_category_id => category_list )
      number_of_meanings = meanings.length
      puts number_of_meanings
      temp = Meaning.new
      if number_of_meanings == 0
        next
      elsif number_of_meanings == 1 #has one meaning
        temp = meanings[0]
      else
        number_of_meanings.times do |index|
          puts "Inside the looooooooooooooooooooop"
          puts chinese_sentence
          puts meanings[index].word_chinese
          if chinese_sentence.to_s.include? ChineseWords.find(meanings[index].chinese_word_id).chinese_meaning
            temp = meanings[index]
          end
        end
      end

      if temp.chinese_word_id.nil?
        temp = meanings[0]
      end

      @text[word]= Hash.new
      @original_word_chinese_id = temp.chinese_word_id
      @user_id = User.where(:user_name => @user_name).first.id
      # see if the user understands this word before
      @text[word]['chinese']= ChineseWords.find(temp.chinese_word_id).chinese_meaning
      @text[word]['pronunciation']= ChineseWords.find(temp.chinese_word_id).pronunciation
      
      testEntry = History.where(:user_id => @user_id, :meaning_id => temp.id).first
      if testEntry.blank? or testEntry.frequency <= 3  #just translate the word
        @text[word]['is_test']=0
      elsif testEntry.frequency > 3 and testEntry.frequency < 7 #testing mah
        @text[word]['is_test']=1
        @text[word]['choices']=Hash.new
        choices = Meaning.where(:word_category_id => category_list).where("english_word_id != ?", @original_word_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s]=EnglishWords.find(val.english_word_id)
        }
      elsif testEntry.frequency > 6 and testEntry.frequency < 10
        @text[word]['is_test']=2
        @text[word]['choices']=Hash.new
        choices = Meaning.where(:word_category_id => category_list).where("chinese_word_id != ?", @original_word_chinese_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s]=ChineseWords.find(val.chinese_word_id)
        }
      else
        next
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
    # to be done when naijia api is updated
    @word_english = params[:word].downcase.singularize#params[:word_english].downcase.singularize
    @word_chinese = "到"#params[:word_chinese]
    @ifRemember = params[:is_remembered].to_i
    @url = params[:url]

    @english_word_id = EnglishWords.where(:english_meaning => @word_english).first.id
    @chinese_word_id = ChineseWords.where(:chinese_meaning => @word_chinese).first.id
    @meaning_id= Meaning.where(:english_word_id => @english_word_id, :chinese_word_id => @chinese_word_id ).first.id
    @user_id = User.where(:user_name => @user_name).first.id
    testEntry = History.where(:meaning_id => @meaning_id, :user_id => @user_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      testEntry.frequency= @ifRemember==0? 0 : testEntry.frequency+1 
      testEntry.url = @url
      testEntry.save
    else # this is a new word the user has some operations on
      understand = History.new
      understand.user_id = @user_id
      understand.meaning_id = @meaning_id
      understand.url = @url
      understand.frequency = @ifRemember
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
      newUser.if_translate = 1
      newUser.translate_categories = "1,2,3,4" # the default will be translate all
      newUser.save
    end

    if user.blank? #no user
      @number['learnt']=0
      @number['tolearn']=0
    else
      @user_id = user.id
      @querylearnt = "user_id=" + @user_id.to_s+ " and frequency > 0"
      @querytolearn = "user_id=" + @user_id.to_s+ " and frequency = 0"
      @number['learnt']=History.count('user_id', :conditions => [@querylearnt])
      @number['tolearn']=History.count('user_id', :conditions => [@querytolearn])
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
