'use script';

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

var userAccount;
var isWorking;

function occurrences(string, substring) {
	var n = 0;
	var pos = 0;
	var l = substring.length;

	while (true) {
		pos = string.indexOf(substring, pos);
		if (pos > -1) {
			n++;
			pos += l;
		} else {
			break;
		}
	}
	return (n);
}


function talkToHeroku(url, params, index){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    console.log("here");
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log("here?");
            var response = xhr.responseText.replace(/&quot;/g,'"');
            var obj=JSON.parse(response);
            console.log(obj);
            //document.getElementByTagName("title").innerHTML = obj["chinese"]
            if(obj.chinese!==undefined){
                //console.log(obj.chinese);
            }
            var data = JSON.parse(response);
            var sourceWords = [];
            var targetWords = [];
            for (var x in data) {
				sourceWords.push(x);
				targetWords.push(data[x]);
				console.log(x+" "+data[x]);
			}
			replaceWords(sourceWords, targetWords, index);
            //document.getElementById('article').innerHTML  = obj["chinese"];
        }
        else {// Show what went wrong
            //document.getElementById('article').innerHTML  = "Something Went Wrong";
        }
    }
    xhr.send(params);
}


function replaceWords(sourceWords, targetWords, i){

	var paragraphs = document.getElementsByClassName('cnn_storypgraphtxt');

	for(var j = 0;j < sourceWords.length; j++){

		var sourceWord = sourceWords[j];
		var targetWord = targetWords[j];

    	var paragraph = paragraphs[i];
    	var text = paragraph.innerHTML;
    	if(i==0){
    		console.log(paragraph.innerHTML);
    		console.log(paragraph.innerText);
    	}

		var id = "myID_"+sourceWord+"_"+i.toString();
		console.log(id);

		var popoverContent = "";
    	popoverContent += "<button id=\""+ id + "_btn1\" class=\"btn btn-info\">Got it</button>";
    	popoverContent += "<span>    </span>"
    	popoverContent += "<button id=\""+ id + "_btn2\" class=\"btn btn-warning\">Show me</button>";

		var joinString = "";
		joinString += "  <span ";
		joinString += "class = 'fypSpecialClass' ";
		joinString += "style='text-decoration:underline; font-weight: bold; ' ";
		joinString += "data-placement='above' ";
		joinString += "title='"+ "Translated from: <span style=\"font-weight: bold;  font-size:150%;\">" + sourceWord + "</span>' ";
		joinString += "href='#' ";
		joinString += "data-content = '" + popoverContent + "'";
		joinString += "";
		joinString += "";
		joinString += "id = '" + id + "' >";
		joinString += targetWord;
		joinString += "</span>  ";
		//console.log(joinString);

		$(document).on("click", "#"+id+"_btn1", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
			remembered.get('http://testnaijia.herokuapp.com/remember?name='+userAccount+'&word='+word+'&is_remembered=1', function(answer) {
			    console.log("this is answer: "+answer);
			});
			$('.fypSpecialClass').popover('hide');
		});

		$(document).on("click", "#"+id+"_btn2", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
	    	$('.fypSpecialClass').popover('hide');
			remembered.get('http://testnaijia.herokuapp.com/remember?name='+userAccount+'&word='+word+'&is_remembered=0', function(answer) {
			    console.log("this is answer: "+answer);
			});
			window.open("http://dict.youdao.com/search?q="+word+"&keyfrom=dict.index");
		});

		var parts = text.split(" " + sourceWord + " ");
		var t = 1;

		for(var k=0; k< parts.length; k++){
			var n = occurrences(parts[k],"\"");
			if(n%2==1){
				if(t == 1){
					parts[k] = parts[k] + "\"";
					t = 2;
				}
				else{
					parts[k] = "\"" + parts[k];
					t = 1;
				}
			}
		}

    	var result = parts.join(joinString);

    	paragraph.innerHTML = result;
	}

	$('.fypSpecialClass').popover({ html : true, placement : 'bottom' });

/*	$('span').click(function(){
  		var currentId = $(this).attr('id');
  		console.log(currentId);
  		if(currentId.indexOf('myID_') > -1 && (!currentId.indexOf('_btn') > -1)){
			$(this).popover({
				trigger : 'focus',
				html : true,
				placement : bottom,
			    content: function() {
			      return $('#popover_content_wrapper').html();
			    }
			});
  		}
	});*/

	$('.fypSpecialClass').mouseover(function(){
		$(this).css("color","#FF9900");
		$(this).css("cursor","pointer");
	});
	$('.fypSpecialClass').mouseout(function(){
		$(this).css("color","black");
	});
}


window.addEventListener("load", function(){

	userAccount = localStorage.getItem("userAccount");
	isWorking = localStorage.getItem("isWorking");
	if (userAccount == undefined){
		var d = new Date();
		userAccount = "id"+d.getTime()+"_1";
		localStorage.setItem("userAccount",userAccount);
	}
	console.log(userAccount);
	if(isWorking == undefined)
	{
		isWorking = 0;
		localStorage.setItem("isWorking",isWorking);
	}
	console.log("isWorking "+isWorking);

	if(isWorking == 1)
	{
		var paragraphs = document.getElementsByClassName('cnn_storypgraphtxt');

		for (var i = 0; i < paragraphs.length; i++) {

			var sourceWords = [];
			var targetWords = [];

			var stringToServer = paragraphs[i];
			stringToServer = stringToServer.innerHTML;

		    var url='http://testnaijia.herokuapp.com/show';
		    var params = "text="+stringToServer;
		    talkToHeroku(url, params, i);
		}
	}

});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.action == "toggleTranslate")
    {
		localStorage.setItem("isWorking",request.working);
    }
    if (request.action == "changeUserID")
    {
    	localStorage.setItem("userAccount",request.account);
    }
});