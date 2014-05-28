#!bin/env ruby
#encoding: utf-8

class TranslatesController < ApplicationController
  # GET /translates
  # GET /translates.json
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
    @translate = Translate.find(params[:id])
    @text=Hash.new
    @text["English"] = params[:text]
    if @text["English"]=="hello"
      @text["Chinese"]="你好"
    else
      @text["Chinese"]=""
    end
  end

  # GET /translates/new
  # GET /translates/new.json
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
