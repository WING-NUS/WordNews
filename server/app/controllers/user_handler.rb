module UserHandler
  # TODO need session authentication for every request that touches data for user (e.g. learning history)

  # TODO make private, and only allow user creation if id_token is validated
  def make_user(user_name)
    newUser = User.new
    newUser.user_name = user_name
    newUser.if_translate = 1
    newUser.translate_categories = '1,2,3,4' # the default will be translate all
    newUser.save
    newUser
  end

  def make_user_with_google_check(id_token)
    google_email = email_if_google_id_valid(id_token)

    if google_email.blank?
      raise ArgumentError.new('Unable to validate google id token')
    else
      make_user google_email
    end
  end

  def email_if_google_id_valid(id_token)
    require 'net/http'

    response = Net::HTTP.get_response(URI('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token))
    json = JSON.parse(response.body)

    audience = ENV['google_client_id']
    alternate_audience = ENV['google_chrome_extension_client_id']

    valid = audience.strip == json['aud'] || alternate_audience.strip == json['aud']
    if valid
      json['email']
    else
      ''
    end

  end
end
