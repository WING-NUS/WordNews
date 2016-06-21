module UserHandler
  def make_user(user_name)
    newUser = User.new
    newUser.user_name = user_name
    newUser.if_translate = 1
    newUser.translate_categories = "1,2,3,4" # the default will be translate all
    newUser.save
    newUser
  end

  def is_google_id_valid(id_token)
    require 'net/http'

    response = Net::HTTP.get_response(URI('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token))
    json = JSON.parse(response.body)

    audience = ENV["google_client_id"]
    alternate_audience = ENV["google_chrome_extension_client_id"]

    audience.strip == json['aud'] || alternate_audience.strip == json['aud']
  end
end
