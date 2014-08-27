class DictionariesController < ApplicationController
  # GET /dictionaries
  # GET /dictionaries.json
  def index
    @dictionaries = Dictionary.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @dictionaries }
    end
  end

  # GET /dictionaries/1
  # GET /dictionaries/1.json
  def show
    @dictionary = Dictionary.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @dictionary }
    end
  end

  # GET /dictionaries/new
  # GET /dictionaries/new.json
  def new
    @dictionary = Dictionary.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @dictionary }
    end
  end

  # GET /dictionaries/1/edit
  def edit
    @dictionary = Dictionary.find(params[:id])
  end

  # POST /dictionaries
  # POST /dictionaries.json
  def create
    @dictionary = Dictionary.new(params[:dictionary])

    respond_to do |format|
      if @dictionary.save
        format.html { redirect_to @dictionary, notice: 'Dictionary was successfully created.' }
        format.json { render json: @dictionary, status: :created, location: @dictionary }
      else
        format.html { render action: "new" }
        format.json { render json: @dictionary.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /dictionaries/1
  # PUT /dictionaries/1.json
  def update
    @dictionary = Dictionary.find(params[:id])

    respond_to do |format|
      if @dictionary.update_attributes(params[:dictionary])
        format.html { redirect_to @dictionary, notice: 'Dictionary was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @dictionary.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dictionaries/1
  # DELETE /dictionaries/1.json
  def destroy
    @dictionary = Dictionary.find(params[:id])
    @dictionary.destroy

    respond_to do |format|
      format.html { redirect_to dictionaries_url }
      format.json { head :no_content }
    end
  end
end
