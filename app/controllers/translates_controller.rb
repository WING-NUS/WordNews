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
    
    @text = Hash.new
    word_list = params[:text].split(" ")
    chinese_sentence = Bing.translate(params[:text].to_s,"en","zh-CHS")
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

      meanings = Meaning.where(:english_words_id => @original_word_id, :word_category_id => category_list )
      number_of_meanings = meanings.length
      
      temp = Meaning.new
      if number_of_meanings == 0
        next
      elsif number_of_meanings == 1 #has one meaning
        temp = meanings[0]
      else
        number_of_meanings.times do |index|
          if chinese_sentence.to_s.include? ChineseWords.find(meanings[index].chinese_words_id).chinese_meaning
            temp = meanings[index]
          end
        end
      end

      if temp.chinese_words_id.nil?
        temp = meanings[0]
      end


      @text[word] = Hash.new
      @original_word_chinese_id = temp.chinese_words_id
      @user_id = User.where(:user_name => @user_name).first.id

      # see if the user understands this word before
      @text[word]['wordID'] = temp.id #pass meaning Id to extension
      @text[word]['chinese'] = ChineseWords.find(temp.chinese_words_id).chinese_meaning
      @text[word]['pronunciation'] = ChineseWords.find(temp.chinese_words_id).pronunciation
      
      testEntry = History.where(:user_id => @user_id, :meaning_id => temp.id).first
      if testEntry.blank? or testEntry.frequency <= 3  #just translate the word
        @text[word]['isTest'] = 0

      elsif testEntry.frequency > 3 and testEntry.frequency <= 6 #testing mah
        @text[word]['isTest'] = 1
        @text[word]['choices'] = Hash.new

        choices = Meaning.where(:word_category_id => category_list).where("english_words_id != ?", @original_word_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s] = EnglishWords.find(val.english_words_id).english_meaning
        }

      elsif testEntry.frequency > 6 and testEntry.frequency <= 10
        @text[word]['isTest'] = 2
        @text[word]['choices'] = Hash.new

        choices = Meaning.where(:word_category_id => category_list).where("chinese_words_id != ?", @original_word_chinese_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s] = ChineseWords.find(val.chinese_words_id).chinese_meaning
        }

      elsif testEntry.frequency > 11
        @text[word]['isTest'] = 1
        @text[word]['choices'] = Hash.new
        
        category = 'Technology' # TODO extract category
        level = 3
        word_under_test = original_word

        distractors_str = `python "public/MCQ Generation/MCQGenerator.py" #{category} #{level} #{word_under_test}`
        distractors = distractors_str.split(',')
        
        distractors.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s] = val.strip
        }
      end

    end # end of for word in word_list

    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @translate }
    end
  end


  def getExampleSentences
    @meaning_id = params[:wordID]
    sentence_list = MeaningsExampleSentence.where(:meaning_id => @meaning_id)

    @text = Hash.new
    @text['chineseSentence'] = Hash.new
    @text['englishSentence'] = Hash.new
    sentence_list.each_with_index{ |val, idx|
      @text['chineseSentence'][idx.to_s] = ExampleSentence.find(val.example_sentences_id).chinese_sentence
      @text['englishSentence'][idx.to_s] = ExampleSentence.find(val.example_sentences_id).english_sentence
    }

    respond_to do |format|
      format.html { render :layout => false }# new.html.erb
      format.json { render json: @translate }
    end
  end

  # get /getQuiz
  def quiz
    @token = params[:word]
    @category = params[:category]
    @knowledge_level = params[:level]
    
    # use a doubly-nested structure for now, as so to support receiving multiple tokens in future
    @result = Hash.new  
    @result[@token] = Hash.new
    @result[@token]['isTest'] = 1    # TODO rename isTest to testType
    @result[@token]['choices'] = Hash.new

    category = @category
    level = @knowledge_level
    word_under_test = @token

    distractors_str = `python "public/MCQ Generation/MCQGenerator.py" #{category} #{level} #{word_under_test}`
    distractors = distractors_str.split(',')

    distractors.each_with_index { |val, idx|   
      @result[word]['choices'][idx.to_s] = val.strip
    }
    
    respond_to do |format|
      format.json { render json: @result}
    end 
  end

  # GET /translates/new
  # GET /translates/new.json

  def remember 
    @user_name = params[:name]
    @ifRemember = params[:isRemembered].to_i
    @url = params[:url]
    @meaning_id = params[:wordID]
    @user_id = User.where(:user_name => @user_name).first.id
    testEntry = History.where(:meaning_id => @meaning_id, :user_id => @user_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      if @ifRemember == 0
        testEntry.frequency = 0
      else
        testEntry.frequency= testEntry.frequency+1 
      end
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
      @number['learnt'] = 0
      @number['toLearn'] = 0
    else
      @user_id = user.id
      @querylearnt = "user_id=" + @user_id.to_s+ " and frequency > 0"
      @querytolearn = "user_id=" + @user_id.to_s+ " and frequency = 0"
      @number['learnt'] = History.count('user_id', :conditions => [@querylearnt])
      @number['toLearn'] = History.count('user_id', :conditions => [@querytolearn])
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
