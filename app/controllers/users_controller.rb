class UsersController < ApplicationController
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

  def getIfTranslate
    @user_name = params[:name]
    @find_user_query = "user_name = '" + @user_name+"'"
    @user = User.where(:user_name => @user_name).first
    if @user.blank? #no user
      newUser = User.new
      newUser.user_name = @user_name
      newUser.if_translate = 1
      newUser.translate_categories = "1,2,3,4" # the default will be translate all
      newUser.save
    end
    @user = User.where(:user_name => @user_name).first
    @ifTranslate = @user.if_translate
    @result = Hash.new
    @result['if_translate'] = @ifTranslate
    respond_to do |format|
      format.html { render :layout => false }
    end
  end

  def getSuggestURL
    @result = Hash.new
    @result['url'] = "http://zhaoyue.com/cn"
    respond_to do |format|
      format.html { render :layout => false }
    end
  end

  def displayHistory
    @user_name = params[:name]
    @user = User.where(:user_name => @user_name).first
    @find_to_learn_query = "user_id = " + @user.id.to_s + " and frequency = 0"
    @find_learnt_query = "user_id = " + @user.id.to_s + " and frequency > 0"
    @MeaningToLearnIdList = History.find(:all, :select => "meaning_id",:conditions => [@find_to_learn_query] )
    @wordsToLearn=[]
    if @MeaningToLearnIdList.length !=0
      for id in @MeaningToLearnIdList
        @temp = Meaning.find(id.meaning_id)
        @wordsToLearn.push(@temp)
      end
    end

    @MeaningLearntIdList = History.find(:all, :select => "meaning_id",:conditions => [@find_learnt_query] )
    @wordsLearnt = []
    if @MeaningLearntIdList.length !=0 
      for id in @MeaningLearntIdList
        @temp = Meaning.find(id.meaning_id)
        @wordsLearnt.push(@temp)
      end
    end

    respond_to do |format|
      format.html # displayHistory.html.erb
      format.json { render json: @user }
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

  def log
    @user = User.where(:user_name => params[:id]).first
    @time_elapsed = params[:time]
    @move = params[:move]

    puts "Log: User " + @user.id.to_s + ":" + @time_elapsed.to_s + ":" + @move.to_s
    respond_to do |format|
      format.html { render :nothing => true, :status =>200 }
    end
  end
end
