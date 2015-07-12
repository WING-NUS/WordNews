module Bing
	# Specify all arguments
	def Bing.translate(text, from, to)
		translator = BingTranslator.new(ENV["bingid"], ENV["bingkey"], ENV["bingaccount"])
        #puts ENV["bingid"]
        #puts ENV["bingkey"]
		# Or... Specify only required arguments
		#translator = BingTranslator.new('LearnNews', 'jvdytVMvoC+DNOHQUBk2UbMBv3kydl8/hPFGUtxlod0=', false, )

		chinese = translator.translate text, :from => from, :to => to #'zh-CHS'
		# without :from for auto language detection
		# spanish = translator.translate 'Hello. This will be translated!', :to => 'es'
		#puts chinese
		#audio = translator.speak '今天应该吃什么东西啊', :language => 'zh-CHS', :format => 'audio/mp3', :options => 'MaxQuality'
		#open('file.mp3', 'wb') { |f| f.write audio }
		# puts audio
		# Account balance
		translator.balance # => 20000
		return chinese
	end

	def speak(text, language)
		audio = translator.speak text, :language => language, :format => 'audio/mp3', :options => 'MaxQuality'
		open(text+'.mp3', 'wb') { |f| f.write audio }
		translator.balance # => 20000

	end

	def get_access_token
	  begin
	    translator = BingTranslator.new('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET', false, 'AZURE_ACCOUNT_KEY')
	    token = translator.get_access_token
	    token[:status] = 'success'
	  rescue Exception => exception
	    YourApp.error_logger.error("Bing Translator: \"#{exception.message}\"")
	    token = { :status => exception.message }
	  end
	  token
	end
end
