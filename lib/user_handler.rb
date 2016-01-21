module UserHandler
  def make_user(user_name)
    newUser = User.new
    newUser.user_name = user_name
    newUser.if_translate = 1
    newUser.translate_categories = "1,2,3,4" # the default will be translate all
    newUser.save
    newUser
  end
end
