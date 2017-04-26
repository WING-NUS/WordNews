require 'test_helper'

class TranslatesControllerTest < ActionController::TestCase
  setup do
    @translate = translates(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:translates)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create translate" do
    assert_difference('Translate.count') do
      post :create, translate: {  }
    end

    assert_redirected_to translate_path(assigns(:translate))
  end

  test "should show translate" do
    get :show, id: @translate
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @translate
    assert_response :success
  end

  test "should update translate" do
    put :update, id: @translate, translate: {  }
    assert_redirected_to translate_path(assigns(:translate))
  end

  test "should destroy translate" do
    assert_difference('Translate.count', -1) do
      delete :destroy, id: @translate
    end

    assert_redirected_to translates_path
  end
end
