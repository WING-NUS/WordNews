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

  def displayHistory
    @user_name = params[:name]
    @log = Transaction.new
    @log.user_name = @user_name
    @log.save
    #@user = User.where(:user_name => @user_name).first
    #@user = User.find(1)
    @find_user_query = "user_name = '" + @user_name+"'"
    @user = User.find(:first, :conditions => [ @find_user_query ])
    puts @user.user_id.to_s
    @find_to_learn_query = "user_id = " + @user.user_id.to_s + " and if_understand = 0"
    @find_learnt_query = "user_id = " + @user.user_id.to_s + " and if_understand = 1"
    @wordsToLearnIdList = Understand.find(:all, :select => "word_id",:conditions => [@find_to_learn_query] )
    puts "hahhhhhhhh"
    puts @wordsToLearnIdList.first
    @wordsToLearn=[]
    for id in @wordsToLearnIdList
      @temp_query = "word_id = " + id.word_id.to_s
      @temp = Dictionary.find(:first, :conditions => [ @temp_query ])
      @wordsToLearn.push(@temp)
    end
    @wordsLearntIdList = Understand.find(:all, :select => "word_id",:conditions => [@find_learnt_query] )
    @wordsLearnt = []
    for id in @wordsLearntIdList
      @temp_query = "word_id = " + id.word_id.to_s 
      @temp = Dictionary.find(:first, :conditions => [ @temp_query ])
      @wordsLearnt.push(@temp)
    end


    respond_to do |format|
      format.html # displayHistory.html.erb
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
end
