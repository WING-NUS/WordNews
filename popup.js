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


	function onWindowLoad() {
	var userAccount = "";
	var isWorking = "";
	var categoryParameter = "";
    chrome.storage.sync.get(['userAccount'], function(result){
    	userAccount = result.userAccount;
    	console.log("user acc: "+ result.userAccount);

		if (userAccount == undefined){
			var d = new Date();
			userAccount = "id"+d.getTime()+"_1";
			chrome.storage.sync.set({'userAccount': userAccount}, function() {});
		}
		console.log("userAccount "+userAccount);

/*		if(isWorking == undefined)
		{
			isWorking = 0;
			chrome.storage.sync.set({'isWorking': isWorking});
		}
		console.log("isWorking "+isWorking);
		if(isWorking == 0)
		{
			document.getElementById("turnOn").className = "btn btn-default";
			document.getElementById("turnOff").className = "btn btn-primary active";
		}
		else
		{
			document.getElementById("turnOn").className = "btn btn-primary active";
			document.getElementById("turnOff").className = "btn btn-default";
		}
		if(categoryParameter.indexOf('@1@') !== -1)
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
				if(obj.tolearn!==undefined)
				{
					document.getElementById("toLearn").innerHTML = obj["tolearn"];
				}
		});
    });

	$("input").change(function() {
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
	});

	$('.btn-toggle').click(function() {
			//$(this).find('.btn').toggleClass('active');	
			console.log("isWorking1 "+isWorking);
			if(isWorking==1)
			{
				isWorking = 0;
				chrome.storage.sync.set({'isWorking': isWorking});
				chrome.storage.sync.get(['userAccount', 'isWorking'], function(result){
			    	userAccount = result.userAccount;
			    	isWorking = result.isWorking;
			    	console.log("user isworking: "+ result.isWorking);
			    });
			}
			else
			{
				isWorking = 1;
				chrome.storage.sync.set({'isWorking': isWorking});
			}
			console.log("isWorking2 "+isWorking);

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
}

	window.onload = onWindowLoad;