	var HttpClient = function() {
		this.get = function(aUrl, aCallback) {
				anHttpRequest = new XMLHttpRequest();
				anHttpRequest.onreadystatechange = function() { 
						if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
								aCallback(anHttpRequest.responseText);
				}
				anHttpRequest.open( "GET", aUrl, true );						
				anHttpRequest.send( null );
		}
	}

	var url_front = "http://testnaijia.herokuapp.com/";
	//var url_front = "http://localhost:3000/";

	var userAccount = "";
	var isWorking = "";
	var categoryParameter = "";
	var wordDisplay = "";
	var wordsReplaced = "";

	function onWindowLoad() {
    chrome.storage.sync.get(null, function(result){
    	userAccount = result.userAccount;
    	console.log("user acc: "+ result.userAccount);

		if (userAccount == undefined){
			var d = new Date();
			userAccount = "id"+d.getTime()+"_1";
			chrome.storage.sync.set({'userAccount': userAccount}, function() {});
		}
		console.log("userAccount "+userAccount);

		isWorking = result.isWorking;
		if(isWorking == undefined){
			isWorking = 0;
			chrome.storage.sync.set({'isWorking': isWorking});
		}
		console.log("isWorking "+isWorking);
		if(isWorking == 0){
			document.getElementById("turnOn").className = "btn btn-default";
			document.getElementById("turnOff").className = "btn btn-primary active";
		}
		else{
			document.getElementById("turnOn").className = "btn btn-primary active";
			document.getElementById("turnOff").className = "btn btn-default";
		}

		wordDisplay = result.wordDisplay;
		if(wordDisplay == undefined){
			wordDisplay = 0;
			chrome.storage.sync.set({'wordDisplay': wordDisplay});
		}
		console.log("wordDisplay "+wordDisplay);
		if(wordDisplay == 0){
			document.getElementById("displayEnglish").className = "btn btn-default";
			document.getElementById("displayChinese").className = "btn btn-primary active";
		}
		else{
			document.getElementById("displayEnglish").className = "btn btn-primary active";
			document.getElementById("displayChinese").className = "btn btn-default";
		}

		wordsReplaced = result.wordsReplaced;
		console.log("wordsReplaced "+wordsReplaced);
		if(wordsReplaced == undefined){
			wordsReplaced = 0;
			chrome.storage.sync.set({'wordsReplaced': wordsReplaced});
		}
		else{
			//document.getElementById("wordsReplaced").value = wordsReplaced;
			$("#wordsReplaced").slider({
				precision: 2,
				value: wordsReplaced // Slider will instantiate showing 8.12 due to specified precision
			});
		}

/*		if(categoryParameter.indexOf('@1@') !== -1)
		{
			document.getElementById("inlineCheckbox1").checked = true;
		}
		if(categoryParameter.indexOf('@3@') !== -1)
		{
			document.getElementById("inlineCheckbox3").checked = true;
		}*/


		var remembered = new HttpClient();
		var answer;
		remembered.get(url_front+'/getNumber?name='+userAccount, function(answer) {
				console.log("this is answer: "+answer);
				var obj=JSON.parse(answer);
				console.log(obj);
				if(obj.learnt!==undefined)
				{
					document.getElementById("learnt").innerHTML = obj["learnt"];
				}
				if(obj.toLearn!==undefined)
				{
					document.getElementById("toLearn").innerHTML = obj["toLearn"];
				}
		});
    });

	// With JQuery
	//$("#wordsReplaced").slider();
	$("#wordsReplaced").on("slide", function(slideEvt) {
		chrome.storage.sync.set({'wordsReplaced': slideEvt.value});
	});

/*	$("input").change(function() {
		console.log("1111111");
		categoryParameter = "";
		if(document.getElementById("inlineCheckbox1").checked == true)
		{
			categoryParameter+= "@"+document.getElementById("inlineCheckbox1").value+"@";
		}
		if(document.getElementById("inlineCheckbox3").checked == true)
		{
			categoryParameter+= "@"+document.getElementById("inlineCheckbox3").value+"@";
		}
		chrome.storage.sync.set({'categoryParameter': categoryParameter});
		chrome.storage.sync.get('categoryParameter', function(result){
	    	userAccount = result.categoryParameter;
	    	console.log("user categoryParameter: "+ result.categoryParameter);
	    });
	});*/

	$('.btn-toggle').click(function() {
			//$(this).find('.btn').toggleClass('active');
			console.log("isWorking1 "+isWorking);
			console.log($(this).attr('id'));
			if($(this).attr('id') == "onoff")
			{
				if(isWorking==1)
				{
					isWorking = 0;
					chrome.storage.sync.set({'isWorking': isWorking});
				}
				else
				{
					isWorking = 1;
					chrome.storage.sync.set({'isWorking': isWorking});
				}

				chrome.storage.sync.get(null, function(result){
			    	isWorking = result.isWorking;
			    	console.log("user isworking: "+ result.isWorking);
			    });
			}

			if($(this).attr('id') == "englishchinese")
			{
				if(wordDisplay==1)
				{
					wordDisplay = 0;
					chrome.storage.sync.set({'wordDisplay': wordDisplay});
				}
				else
				{
					wordDisplay = 1;
					chrome.storage.sync.set({'wordDisplay': wordDisplay});
				}

				chrome.storage.sync.get(null, function(result){
			    	wordDisplay = result.wordDisplay;
			    	console.log("user isworking: "+ result.wordDisplay);
			    });
			}

			$(this).find('.btn').toggleClass('active');	
			
			if ($(this).find('.btn-primary').size()>0) {
				$(this).find('.btn').toggleClass('btn-primary');
			}
			if ($(this).find('.btn-danger').size()>0) {
				$(this).find('.btn').toggleClass('btn-danger');
			}
			if ($(this).find('.btn-success').size()>0) {
				$(this).find('.btn').toggleClass('btn-success');
			}
			if ($(this).find('.btn-info').size()>0) {
				$(this).find('.btn').toggleClass('btn-info');
			}
			
			$(this).find('.btn').toggleClass('btn-default');
	});

	$('.btn-block').click(function(){
		window.open(url_front+"displayHistory?name="+userAccount);
	});
	//http://testnaijia.herokuapp.com/settings?name='+userAccount'
	$('#setting').click(function(){
		window.open(url_front+"settings?name="+userAccount);
	});
	//http://testnaijia.herokuapp.com/howtouse
	$('#documentation').click(function(){
		window.open(url_front+"howtouse");
	});
}

	window.onload = onWindowLoad;