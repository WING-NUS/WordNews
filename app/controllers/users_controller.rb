class UsersController < ApplicationController
  include UserHandler
  
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])
    #@user = User.where(:user_name => @user_name).first
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

  def get_if_translate
    @user_name = params[:name]
    
    @user = User.where(:user_name => @user_name).first
    if @user.blank? #no user
      make_user @user_name
    end

    @user = User.where(:user_name => @user_name).first
    @ifTranslate = @user.if_translate
    @result = Hash.new
    @result['if_translate'] = @ifTranslate

    respond_to do |format|
      format.html { render :layout => false }
    end
  end


  def get_suggest_url
    @result = Hash.new
    @result['url'] = "http://zhaoyue.com/cn"
    respond_to do |format|
      format.html { render :layout => false }
    end
  end

  def display_history
    @user_name = params[:name]
    @user = User.where(:user_name => @user_name).first
    find_to_learn_query = 'user_id = ' + @user.id.to_s + ' and frequency = 0'
    find_learnt_query = 'user_id = ' + @user.id.to_s + ' and frequency > 0'
    meaning_to_learn_List = History.all(:select => 'meaning_id', :conditions => [find_to_learn_query])
    @words_to_learn = []
    if meaning_to_learn_List.length !=0
      for meaning in meaning_to_learn_List
        temp = Meaning.find(meaning.meaning_id)
        @words_to_learn.push(temp)
      end
    end

    meaning_learnt_list = History.all(:select => 'meaning_id', :conditions => [find_learnt_query])
    @words_learnt = []
    if meaning_learnt_list.length !=0
      meaning_learnt_list.each do |meaning|
        temp = ChineseWords.joins(:english_words)
                .select('english_meaning, chinese_meaning, meanings.id, english_words_id, chinese_words_id, pronunciation')
        .where('meanings.id = ?', meaning.meaning_id).first
        @words_learnt.push(temp)
      end
    end

    respond_to do |format|
      format.html # displayHistory.html.erb
      format.json { render json: @words_learnt }
    end
  end

  def settings
    @user_name = params[:name]
    @find_user_query = "user_name = '" + @user_name+"'"
    @user = User.find(:first, :conditions => [ @find_user_query ])

    respond_to do |format|
      format.html #{ render :layout => false }# displayHistory.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  # TODO think about deprecating this.
  def log
    @user = User.where(:user_name => params[:id]).first
    @time_elapsed = params[:time]
    @move = params[:move]

    puts "Log: User " + @user.id.to_s + ":" + @time_elapsed.to_s + ":" + @move.to_s
    respond_to do |format|
      format.html { render :nothing => true, :status =>200 }
    end
  end

  def validate_google_id_token
    
    require 'net/http'

    response = Net::HTTP.get_response(URI('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + params[:id_token]))
    json = JSON.parse(response.body)

    audience = ENV["google_client_id"]
	alternate_audience = ENV["google_chrome_extension_client_id"]
	
    valid = audience.strip == json['aud'] || alternate_audience.strip == json['aud']
    if valid
      render status: 200, nothing: true
    else
      logger.info('No valid identity token present')
      render status: 401, nothing: true

    end
  end


end
