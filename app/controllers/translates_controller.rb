#!bin/env ruby
#encoding: utf-8

class TranslatesController < ApplicationController
include UserHandler
  include Bing

  def translate_paragraph(user_id, num_words, paragraph, allow_hard_coded_translation = false)
    @result = Hash.new
    chinese_sentence, alignment = Bing.translate(paragraph.to_s, 'en', 'zh-CHS')

    if alignment.nil?
      # try again
      chinese_sentence, alignment = Bing.translate(paragraph.to_s, 'en', 'zh-CHS')
      if alignment.nil?
        return nil
      end
    end

    alignment = parse_alignment_string(alignment)

    words_retrieved = 0
    index_offset = 0

    word_list = paragraph.split(' ')
    word_list.each do |orig_word|
      word = orig_word.gsub(/[^a-zA-Z]/, '')
      if words_retrieved >= num_words
        break # no need to continue as @num_words is the number of words requested by the client
      end


      normalised_word = word.downcase.singularize
      english_meaning = EnglishWords.joins(:meanings)
                            .select('english_meaning, english_words.id as english_word_id, meanings.id, meanings.chinese_words_id, meanings.word_category_id')
                            .where('english_meaning = ?', normalised_word).first

      zh_word = ''
      if english_meaning.nil?
        # no such english word in our dictionary
        next
      else
        word_index = paragraph.index(orig_word, index_offset)
        index_offset = word_index || index_offset # this is to handle multiple occurrences of the same word in the text
        # don't change index_offset if word_index is nil, which should not happen

        chinese_alignment_pos_start, pos_end = alignment[word_index]

        if pos_end.nil?
          next
        end
        zh_word = chinese_sentence[chinese_alignment_pos_start.. pos_end]

        # find meaning using the chinese word given by bing
        actual_meaning = chinese_meaning(normalised_word, zh_word)

        if actual_meaning.nil?
          next
        end

      end

      @original_word_id = actual_meaning.nil? ? english_meaning.id : actual_meaning.id

      @result[word] = Hash.new

      testEntry = Meaning.joins(:histories)
                      .select('meaning_id, frequency')
                      .where('user_id = ? AND meaning_id = ?', user_id, @original_word_id).first


      @result[word]['wordID'] = @original_word_id # pass id of meaning to the client

      if testEntry.blank? or testEntry.frequency.to_i <= 3 #just translate the word
        if allow_hard_coded_translation
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
          if hard_coded_word.length == 0
            @result[word]['chinese'] = actual_meaning.chinese_meaning
          end
        else
          @result[word]['chinese'] = actual_meaning.chinese_meaning
        end

        words_retrieved = words_retrieved + 1

        @result[word]['pronunciation'] = ''

        possible_pronunciation = ChineseWords.where('chinese_meaning = ?', actual_meaning.chinese_meaning)
        if possible_pronunciation.length > 0
          @result[word]['pronunciation'] = possible_pronunciation.first.pronunciation.strip
        end

        @result[word]['isTest'] = 0
        @result[word]['position'] = word_index

      elsif testEntry.frequency.to_i.between?(4, 5)
        @result[word]['isTest'] = 1
        @result[word]['testType'] = 1
        @result[word]['chinese'] = actual_meaning.chinese_meaning

        @result[word]['choices'] = Hash.new
        choices = Meaning.where(:word_category_id => english_meaning.word_category_id)
                      .where('english_words_id != ?', actual_meaning.english_word_id)
                      .order('RANDOM()')
                      .first(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = EnglishWords.find(val.english_words_id).english_meaning
        }
        @result[word]['isChoicesProvided'] = !(choices.empty?)

      else

        @result[word]['isTest'] = 2
        @result[word]['testType'] = 2
        @result[word]['isChoicesProvided'] = true
        @result[word]['chinese'] = actual_meaning.chinese_meaning

        @result[word]['choices'] = Hash.new
        choices = Meaning.where(:word_category_id => english_meaning.word_category_id)
                      .where('chinese_words_id != ?', actual_meaning.chinese_words_id)
                      .order('RANDOM()')
                      .first(3)
        choices.each_with_index { |val, idx|
          @result[word]['choices'][idx.to_s] = ChineseWords.find(val.chinese_words_id).chinese_meaning
        }

      end

    end # end of for word in word_list
    @result
  end

  def show_by_bing

    user_name = params[:name]
    url = params[:url].chomp '/'
    num_words = params[:num_words].to_i || 2

    user = User.where(:user_name => user_name).first
    if user.nil?
      user = make_user user_name
    end
    user_id = user.id

    @result = translate_paragraph(user_id, num_words, params[:text])

    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
      format.json { render json: @result }
    end
  end

  def chinese_meaning(english, chinese)
    actual_meanings = EnglishWords.joins(:chinese_words)
                          .select('english_meaning, meanings.id, english_words.id as english_word_id, meanings.chinese_words_id, meanings.word_category_id, chinese_meaning, pronunciation')
                          .where('english_meaning = ?', english)
    actual_meaning = nil
    # actual meanings contains the set of possible english-meaning-chinese words
    actual_meanings.each do |possible_actual_meaning|
      possible_chinese_match = possible_actual_meaning.chinese_meaning
      if possible_chinese_match == chinese
        actual_meaning = possible_actual_meaning
        break
      end

    end
    actual_meaning
  end


  def get_example_sentences
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


  def remember
    @user_name = params[:name]
    @is_remember = params[:isRemembered].to_i
    @url = params[:url]
    @meaning_id = params[:wordID] || params[:wordId]
    @user_id = User.where(:user_name => @user_name).first.id
    testEntry = History.where(:meaning_id => @meaning_id, :user_id => @user_id).first
    if not testEntry.blank? # the user has seen this word before, just change the if_understand field
      if @is_remember == 0
        testEntry.frequency = 0
      else
        testEntry.frequency= testEntry.frequency+1
      end
      puts 'frequency of word with id = '
      puts @user_id 
      puts 'wordID'
      puts @meaning_id
      puts testEntry.frequency

      testEntry.url = @url
      testEntry.save
    else # this is a new word the user has some operations on
      understand = History.new
      understand.user_id = @user_id
      understand.meaning_id = @meaning_id
      understand.url = @url
      understand.frequency = @is_remember
      understand.save
    end
    respond_to do |format|
      format.html { render :layout => false } # new.html.erb
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
      newUser.translate_categories = '1,2,3,4' # the default will be translate all # TODO what does this do?
      newUser.save
    end

    if user.blank? #no user
      @number['learnt'] = 0
      @number['toLearn'] = 0
    else
      @user_id = user.id
      @querylearnt = 'user_id=' + @user_id.to_s+ ' and frequency > 0'
      @querytolearn = 'user_id=' + @user_id.to_s+ ' and frequency = 0'
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
    alignments.split(' ').each do |mapping|
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
