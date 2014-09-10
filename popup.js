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

	//var url_front = "http://testnaijia.herokuapp.com/";
	var url_front = "http://localhost:3000/";


	function onWindowLoad() {

	var userAccount = localStorage.getItem("userAccount");
	var isWorking = localStorage.getItem("isWorking");
	if (userAccount == undefined){
		var d = new Date();
		userAccount = "id"+d.getTime()+"_1";
		localStorage.setItem("userAccount",userAccount);
	}
	console.log("userAccount "+userAccount);

	if(isWorking == undefined)
	{
		isWorking = 0;
		localStorage.setItem("isWorking",isWorking);
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

	$('.btn-toggle').click(function() {
			//$(this).find('.btn').toggleClass('active');	
			console.log("isWorking1 "+isWorking);
			if(isWorking==1)
			{
				isWorking = 0;
				localStorage.setItem("isWorking",0);

			}
			else
			{
				isWorking = 1;
				localStorage.setItem("isWorking",1);
			}
			console.log("isWorking2 "+isWorking);

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { action: "toggleTranslate" , working: isWorking});
			});

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

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "changeUserID" , account: userAccount});
  });
}

	window.onload = onWindowLoad;