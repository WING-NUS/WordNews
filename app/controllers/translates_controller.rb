#!bin/env ruby
#encoding: utf-8

require 'nokogiri'
require 'open-uri'
require 'watir-webdriver'

class TranslatesController < ApplicationController
include UserHandler
  include Bing

  def index
    @translates = Translate.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @translates }
    end
  end


  def paragraphs_in_article
    url_of_article = params[:url]

    browser = Watir::Browser.new :phantomjs
    browser.goto url_of_article 

    if !browser.url.include? url_of_article
      browser.goto url_of_article # try again
    end
    if !browser.url.include? url_of_article
      puts "unable to reach the required website"
      raise RuntimeError, "unable to reach the required website"
    end

    paragraphs = browser.elements(:css => 'p')

    @result = Hash.new
    paragraphs.each_with_index { |paragraph, index |
      paragraph_data = Hash.new
      paragraph_data['text'] = paragraph.text

      @result[index] = paragraph_data
    }

    render json: @result
  end


  def show

    @result = Hash.new
    word_list = params[:text].split(" ")
    #chinese_sentence = Bing.translate(params[:text].to_s,"en","zh-CHS")
    chinese_sentence = ''
    @user_name = params[:name]
    @url = params[:url].chomp '/'
    @num_words = params[:num_words].to_i || 2

    user = User.where(:user_name => @user_name).first
    if user.nil?
      user = make_user @user_name
    end
    user_id = user.id
    category_list = user.translate_categories.split(",")

    words_retrieved = 0
    for word in word_list
      word = word.gsub(/[^a-zA-Z]/, "")
      if words_retrieved >= @num_words
        break # no need to continue as @num_words is the number of words requested by the client
      end

      #this is to add downcase and singularize support
      original_word = word.downcase.singularize
      english_meaning_row = EnglishWords.joins(:meanings)
                                .select('english_meaning, meanings.id, meanings.chinese_words_id, meanings.word_category_id')
                                .where("english_meaning = ?", original_word)

      english_meaning = nil
      if english_meaning_row.length == 0
        next
      elsif english_meaning_row.length == 1 #has one meaning
        english_meaning = english_meaning_row.first
      else
        # multiple matching meanings
        english_meaning = english_meaning_row.first # take the first meaning by default, unless a sentence matches

        english_meaning_row.length.times do |index|
          # checks if the bing-translated chinese sentence contains the chinese word retrieved
          if chinese_sentence.to_s.include? ChineseWords.find(english_meaning_row[index].chinese_words_id).chinese_meaning
            english_meaning = english_meaning_row[index]
            break
          end
        end
      end

      @result[word] = Hash.new

      # check if a hard-coded translation is specified for this word
      hard_coded_word = HardCodedWord.where(:url => @url, :word => original_word)
      if hard_coded_word.length > 0
        if hard_coded_word.first.translation?
          @result[word]['chinese'] = hard_coded_word.first.translation
        else
          @result.delete(word)
          next
        end
      end

      @original_word_id = english_meaning_row.first.id


      #if temp.chinese_words_id.nil?
      #  english_meaning = meanings[0]
      #end

      # if this point is reached, then the word and related information is sent back
      words_retrieved = words_retrieved + 1

      @original_word_chinese_id = english_meaning.chinese_words_id

      # see if the user understands this word before
      @result[word]['wordID'] = english_meaning.id # pass meaningId to client
      chinese_word = ChineseWords.find(english_meaning.chinese_words_id)
      if hard_coded_word.length == 0
        @result[word]['chinese'] = chinese_word.chinese_meaning
      end
      @result[word]['pronunciation'] = chinese_word.pronunciation


      #@user_id = User.where(:user_name => @user_name).first.id
      testEntry = Meaning.joins(:histories)
                      .select('meaning_id, frequency')
                      .where("user_id = ? AND meaning_id = ?", user_id, english_meaning.id).first


      if testEntry.blank? or testEntry.frequency.to_i <= 3 #just translate the word
        @result[word]['isTest'] = 0

      elsif testEntry.frequency.to_i > 3 and testEntry.frequency.to_i <= 6 # quiz 
        @result[word]['isTest'] = 1
        @result[word]['choices'] = Hash.new
        @result[word]['isChoicesProvided'] = true

        choices = Meaning.where(:word_category_id => english_meaning.word_category_id).where("english_words_id != ?", @original_word_id).random(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = EnglishWords.find(val.english_words_id).english_meaning
        }

        hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word)
        # if there is a hard coded quiz, replace the words with the hard-coded values
        if hard_coded_quiz.length > 0

          @result[word]['choices']['0'] = hard_coded_quiz.first.option1
          @result[word]['choices']['1'] = hard_coded_quiz.first.option2
          @result[word]['choices']['2'] = hard_coded_quiz.first.option3
          @result[word]['isTest'] = hard_coded_quiz.first.quiz_type
        end

      elsif testEntry.frequency.to_i > 6 and testEntry.frequency.to_i <= 10
        @result[word]['isTest'] = 2
        @result[word]['choices'] = Hash.new
        @result[word]['isChoicesProvided'] = true

        choices = Meaning.where(:word_category_id => english_meaning.word_category_id).where("chinese_words_id != ?", @original_word_chinese_id).random(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = ChineseWords.find(val.chinese_words_id).chinese_meaning
        }

        hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word)
        # if there is a hard coded quiz, replace the words with the hard-coded values
        if hard_coded_quiz.length > 0

          @result[word]['choices']['0'] = hard_coded_quiz.first.option1
          @result[word]['choices']['1'] = hard_coded_quiz.first.option2
          @result[word]['choices']['2'] = hard_coded_quiz.first.option3
          @result[word]['isTest'] = hard_coded_quiz.first.quiz_type
        end
      elsif testEntry.frequency.to_i >= 11
        next
        #@text[word]['isTest'] = 1
        #@text[word]['choices'] = Hash.new

        #category = 'Technology' # TODO extract category
        #level = 3
        #word_under_test = original_word

        #distractors_str = `python "public/MCQ Generation/MCQGenerator.py" #{category} #{level} #{word_under_test}`
        #distractors = distractors_str.split(',')

        #distractors.each_with_index { |val, idx|   
        #  @text[word]['choices'][idx.to_s] = val.strip
        #}
        #@text[word]['isChoicesProvided'] = false
      end

    end # end of for word in word_list

    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @translate }
    end
  end

  def show_by_bing
    @result = Hash.new
    word_list = params[:text].split(" ")
    chinese_sentence, alignment = Bing.translate(params[:text].to_s, 'en', 'zh-CHS')

    alignment = parse_alignment_string(alignment)

    @user_name = params[:name]
    @url = params[:url].chomp '/'
    @num_words = params[:num_words].to_i || 2

    user = User.where(:user_name => @user_name).first
    if user.nil?
      user = make_user @user_name
    end
    user_id = user.id

    words_retrieved = 0
    index_offset = 0
    for word in word_list
      orig_word = word
      word = word.gsub(/[^a-zA-Z]/, '')
      if words_retrieved >= @num_words
        break # no need to continue as @num_words is the number of words requested by the client
      end

      #this is to add downcase and singularize support
      normalised_word = word.downcase.singularize
      english_meaning_row = EnglishWords.joins(:meanings)
                                .select('english_meaning, meanings.id, meanings.chinese_words_id, meanings.word_category_id')
                                .where("english_meaning = ?", normalised_word)

      english_meaning = english_meaning_row.first
      zh_word = ''
      if english_meaning_row.length == 0
        # no such english word in our dictionary
        next
      elsif english_meaning_row.length >= 1 # english word is in our dictionary
        word_index = params[:text].index(orig_word, index_offset)
        index_offset = word_index || index_offset # this is to handle multiple occurences of the same word in the text
        # don't change index_offset if word_index is nil, which should not happen

        chinese_alignment_pos_start, pos_end = alignment[word_index]

        if pos_end.nil?
          # bing thinks that the word is part of a longer phrase, so we do not translate
          next
        end
        zh_word = chinese_sentence[chinese_alignment_pos_start.. pos_end]

        # find meaning using the chinese word given by bing
        actual_meanings = EnglishWords.joins(:meanings).joins(:chinese_words)
                                     .select('english_meaning, meanings.id, meanings.chinese_words_id, meanings.word_category_id, chinese_meaning')
                                     .where('english_meaning = ?', normalised_word)
        actual_meaning = actual_meanings.first
        # actual meanings contains the set of possible english-meaning-chinese words
        for possible_actual_meaning in actual_meanings
            possible_chinese_match = ChineseWords.find(possible_actual_meaning.chinese_words_id).chinese_meaning
            if possible_chinese_match.include? zh_word or zh_word.include? possible_chinese_match
                actual_meaning = possible_actual_meaning
                break
            end

        end

      end




      

      @result[word] = Hash.new


      testEntry = Meaning.joins(:histories)
                      .select('meaning_id, frequency')
                      .where("user_id = ? AND meaning_id = ?", user_id, english_meaning_row.first.id).first

      if testEntry.blank? or testEntry.frequency.to_i <= 3 #just translate the word
        # check if a hard-coded translation is specified for this word
        hard_coded_word = HardCodedWord.where(:url => @url, :word => normalised_word)
        if hard_coded_word.length > 0
          if hard_coded_word.first.translation?
            @result[word]['chinese'] = hard_coded_word.first.translation
          else
            @result.delete(word)
            next
          end
        end

        @original_word_id = actual_meaning.nil? ? english_meaning_row.first.id : actual_meaning.id

        # if this point is reached, then the word and related information is sent back
        words_retrieved = words_retrieved + 1

        @result[word]['wordID'] = @original_word_id # pass meaningId to client
        if hard_coded_word.length == 0
          @result[word]['chinese'] = zh_word
        end
        @result[word]['pronunciation'] = '' # bing can return words not in our dictionary, so we don't bother trying to find the pronunciation

        @result[word]['isTest'] = 0
        @result[word]['position'] = word_index

      elsif testEntry.frequency.to_i.between?(4,5)
        @result[word]['isTest'] = 1
        @result[word]['choices'] = Hash.new
        @result[word]['chinese'] = zh_word

        choices = Meaning.where(:word_category_id => english_meaning.word_category_id).where("english_words_id != ?", @original_word_id).random(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = EnglishWords.find(val.english_words_id).english_meaning
        }
        @result[word]['isChoicesProvided'] = !(choices.empty?)

        #hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word)
        # if there is a hard coded quiz, replace the words with the hard-coded values
        #if hard_coded_quiz.length > 0

        #  @text[word]['choices']['0'] = hard_coded_quiz.first.option1
        #  @text[word]['choices']['1'] = hard_coded_quiz.first.option2
         # @text[word]['choices']['2'] = hard_coded_quiz.first.option3
        #  @text[word]['isTest'] = hard_coded_quiz.first.quiz_type
        #end

      elsif testEntry.frequency.to_i > 6

        # don't need to compute
        @result[word]['isTest'] = 2
        @result[word]['choices'] = Hash.new
        @result[word]['isChoicesProvided'] = true
        @result[word]['chinese'] = zh_word

        choices = Meaning.where(:word_category_id => english_meaning.word_category_id).where("chinese_words_id != ?", actual_meaning.chinese_words_id).random(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = ChineseWords.find(val.chinese_words_id).chinese_meaning
        }

        #hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => original_word)
        # if there is a hard coded quiz, replace the words with the hard-coded values
        #if hard_coded_quiz.length > 0

        #  @text[word]['choices']['0'] = hard_coded_quiz.first.option1
        #  @text[word]['choices']['1'] = hard_coded_quiz.first.option2
        #  @text[word]['choices']['2'] = hard_coded_quiz.first.option3
        #  @text[word]['isTest'] = hard_coded_quiz.first.quiz_type
        #end
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

    @result = Hash.new
    @result['chineseSentence'] = Hash.new
    @result['englishSentence'] = Hash.new
    sentence_list.each_with_index { |val, idx|
      @result['chineseSentence'][idx.to_s] = ExampleSentence.find(val.example_sentences_id).chinese_sentence
      @result['englishSentence'][idx.to_s] = ExampleSentence.find(val.example_sentences_id).english_sentence
    }

    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @translate }
    end
  end

  # get /getQuiz
  def quiz
    @token = params[:word]
    @category = params[:category]
    @knowledge_level = params[:level]
    @sentence = params[:sentence]

    # use a doubly-nested structure for now, as so to support receiving multiple tokens in future
    @result = Hash.new
    @result[@token] = Hash.new
    @result[@token]['isTest'] = 1 # TODO rename isTest to testType
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

    hard_coded_quiz = HardCodedQuiz.where(:url => @url, :word => @token)
    if hard_coded_quiz.length > 0

      @result[word]['choices']['0'] = hard_coded_word.first.option1
      @result[word]['choices']['1'] = hard_coded_word.first.option2
      @result[word]['choices']['2'] = hard_coded_word.first.option3
    end

    respond_to do |format|
      format.json { render json: @result }
    end
  end

  # GET /translates/new
  # GET /translates/new.json

  def remember
    @user_name = params[:name]
    @isRemember = params[:isRemembered].to_i
    @url = params[:url]
    @meaning_id = params[:wordID]
    @user_id = User.where(:user_name => @user_name).first.id
    testEntry = History.where(:meaning_id => @meaning_id, :user_id => @user_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      if @isRemember == 0
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
      understand.frequency = @isRemember
      understand.save
    end
    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
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
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @translate }
    end
  end

  def parse_alignment_string(alignments)
    aligned_positions = Hash.new
    for mapping in alignments.split(" ")
      lhs = mapping.split('-')[0]
      start_of_lhs = lhs.split(':')[0]

      rhs = mapping.split('-')[1]
      start_of_rhs = rhs.split(':')[0]
      end_of_rhs = rhs.split(':')[1]

      aligned_positions[start_of_lhs.to_i] = [start_of_rhs.to_i, end_of_rhs.to_i]
    end
    aligned_positions
  end


end
