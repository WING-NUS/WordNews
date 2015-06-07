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
    @url = params[:url]
    @num_words = params[:num_words].to_i || 2

    user = User.where(:user_name => @user_name).first
    if user.nil?
      user = make_user @user_name
    end
    user_id = user.id
    category_list = user.translate_categories.split(",")

    words_retrieved = 0
    for word in word_list
      if words_retrieved >= @num_words
        break  # no need to continue as @num_words is the number of words requested by the client
      end      

      #this is to add downcase and singularize support
      original_word = word.downcase.singularize
      english_meaning_row = EnglishWords.joins(:meanings)
                                        .select('english_meaning, meanings.id, meanings.chinese_words_id')
                                        .where("english_meaning = ?", original_word)

      english_meaning = nil
      if english_meaning_row.length == 0
        next
      elsif english_meaning_row.length == 1 #has one meaning
        english_meaning = english_meaning_row.first
      else
        #### temporarily not translate tokens with multiple possible chinese substitutions ###
        #number_of_meanings.times do |index|
        #  if chinese_sentence.to_s.include? ChineseWords.find(meanings[index].chinese_words_id).chinese_meaning
        #    english_meaning = meanings[index]
        #  end
        #end
        next
      end

      @text[word] = Hash.new

      # check if a hard-coded translation is specified for this word
      hard_coded_word = HardCodedWord.where(:url => @url, :word => original_word )
      if hard_coded_word.length > 0
        @text[word]['chinese'] = hard_coded_word.first.translation
      end

      @original_word_id = english_meaning_row.first.id
      

      #if temp.chinese_words_id.nil?
      #  english_meaning = meanings[0]
      #end

      # if this point is reached, then the word and related information is sent back
      words_retrieved = words_retrieved + 1

      @original_word_chinese_id = english_meaning.chinese_words_id

      # see if the user understands this word before
      @text[word]['wordID'] = english_meaning.id # pass meaningId to client
      chinese_word = ChineseWords.find(english_meaning.chinese_words_id)
      if hard_coded_word.length == 0
        @text[word]['chinese'] = chinese_word.chinese_meaning
      end
      @text[word]['pronunciation'] = chinese_word.pronunciation
      
      
      #@user_id = User.where(:user_name => @user_name).first.id
      testEntry = Meaning.joins(:histories)
                         .select('meaning_id, frequency')
                         .where("user_id = ? AND meaning_id = ?", user_id, english_meaning.id).first


      if testEntry.blank? or testEntry.frequency.to_i <= 3  #just translate the word
        @text[word]['isTest'] = 0

      elsif testEntry.frequency.to_i > 3 and testEntry.frequency.to_i <= 6 # quiz 
        @text[word]['isTest'] = 1
        @text[word]['choices'] = Hash.new
        @text[word]['isChoicesProvided'] = true

        choices = Meaning.where(:word_category_id => category_list).where("english_words_id != ?", @original_word_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s] = EnglishWords.find(val.english_words_id).english_meaning
        }

        hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word )
        if hard_coded_quiz.length > 0
          
          @text[word]['choices']['0'] = hard_coded_word.first.option1
          @text[word]['choices']['1'] = hard_coded_word.first.option2
          @text[word]['choices']['2'] = hard_coded_word.first.option3
        end

      elsif testEntry.frequency.to_i > 6 and testEntry.frequency.to_i <= 10
        @text[word]['isTest'] = 2
        @text[word]['choices'] = Hash.new
        @text[word]['isChoicesProvided'] = true

        choices = Meaning.where(:word_category_id => category_list).where("chinese_words_id != ?", @original_word_chinese_id).random(3)
        choices.each_with_index { |val, idx|   
          @text[word]['choices'][idx.to_s] = ChineseWords.find(val.chinese_words_id).chinese_meaning
        }

        hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word )
        if hard_coded_quiz.length > 0
          
          @text[word]['choices']['0'] = hard_coded_word.first.option1
          @text[word]['choices']['1'] = hard_coded_word.first.option2
          @text[word]['choices']['2'] = hard_coded_word.first.option3
        end
      elsif testEntry.frequency.to_i >= 11
        @text[word]['isTest'] = 1
        @text[word]['choices'] = Hash.new
        
        category = 'Technology' # TODO extract category
        level = 3
        word_under_test = original_word

        #distractors_str = `python "public/MCQ Generation/MCQGenerator.py" #{category} #{level} #{word_under_test}`
        #distractors = distractors_str.split(',')
        
        #distractors.each_with_index { |val, idx|   
        #  @text[word]['choices'][idx.to_s] = val.strip
        #}
        @text[word]['isChoicesProvided'] = false

      end

    end # end of for word in word_list

    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @translate }
    end
  end

  # TODO put this in another module
  def make_user(user_name)
    newUser = User.new
    newUser.user_name = user_name
    newUser.if_translate = 1
    newUser.translate_categories = "1,2,3,4" # the default will be translate all
    newUser.save
    newUser
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
    distractor_size = distractors.size
    puts "#{word_under_test} has  #{distractors.size} distractors"

    distractors.each_with_index { |val, idx|   
      @result[word_under_test]['choices'][idx.to_s] = val.strip
    }
        
    hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word )
    if hard_coded_quiz.length > 0
          
      @text[word]['choices']['0'] = hard_coded_word.first.option1
      @text[word]['choices']['1'] = hard_coded_word.first.option2
      @text[word]['choices']['2'] = hard_coded_word.first.option3
    end
    
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



end
