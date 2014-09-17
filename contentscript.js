'use script';

var url_front = "http://testnaijia.herokuapp.com/";
//var url_front = "http://localhost:3000/";

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

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var userAccount;
var isWorking;
var categoryParameter;

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
            var sourceWords = [];
            var targetWords = [];
            var is_test = [];
            var other_english1 = [];
            var other_english2 = [];
            var other_english3 = [];
            for (var x in obj) {
				sourceWords.push(x);
				targetWords.push(obj[x].chinese);
				is_test.push(obj[x].is_test);
				if(obj[x].is_test == 1)
				{
					other_english1.push(obj[x]["other_english"]["0"]);
					other_english2.push(obj[x]["other_english"]["1"]);
					other_english3.push(obj[x]["other_english"]["2"]);
					console.log("other english is : "+obj[x]["other_english"]["2"]);
				}
				else
				{
					other_english1.push(" ");
					other_english2.push(" ");
					other_english3.push(" ");
				}
				console.log(x+" "+obj[x]+" "+obj[x].is_test);
			}
			replaceWords(sourceWords, targetWords, is_test, other_english1, other_english2 , other_english3, index);
            //document.getElementById('article').innerHTML  = obj["chinese"];
        }
        else {// Show what went wrong
            //document.getElementById('article').innerHTML  = "Something Went Wrong";
        }
    }
    xhr.send(params);
}


function replaceWords(sourceWords, targetWords, is_test, other_english1, other_english2 , other_english3, i){

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
		var joinString = "";
		if(is_test[j] == 0)
		{
			popoverContent += "<div sytle=\"text-align:center;\">";
	    	popoverContent += "<button id=\""+ id + "_btn1\" class=\"btn btn-info\">Got it</button>";
	    	//popoverContent += "<span>    </span>"
	    	popoverContent += "<button style=\"margin-left:10px\" id=\""+ id + "_btn2\" class=\"btn btn-warning\">Show me</button>";
    		popoverContent += "</div>";

    		joinString += "  <span ";
			joinString += "class = 'fypSpecialClass' ";
			joinString += "style='text-decoration:underline; font-weight: bold; ' ";
			joinString += "data-placement='above' ";
			joinString += "title='"+ "<span style=\"font-weight: bold;  font-size:150%;\">" + sourceWord + "</span>' ";
			joinString += "href='#' ";
			joinString += "data-content = '" + popoverContent + "'";
			joinString += "";
			joinString += "";
			joinString += "id = '" + id + "' >";
			joinString += targetWord;
			joinString += "</span>  ";
    	}
    	else
    	{

    		popoverContent += "<div class = \"row\">";

			var myArrayShuffle = [1,2,3,4];
			myArrayShuffle = shuffle(myArrayShuffle);
			for(var k=0;k<myArrayShuffle.length;k++)
			{
				switch(myArrayShuffle[k])
				{
					case 1:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio1\" value=\"option1\">";
			    		popoverContent += other_english1[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 2:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio2\" value=\"option1\">";
			    		popoverContent += other_english2[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 3:
						popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio3\" value=\"option1\">";
			    		popoverContent += other_english3[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 4:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadioCorrect\" value=\"option1\">";
			    		popoverContent += sourceWord;
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					default:
						break;
				}
				if(k==1)
				{
    				popoverContent += "</div>";
		    		popoverContent += "<div class = \"row\">";
				}
			}

    		popoverContent += "</div>";

	    	//popoverContent += "<button style = \"margin-top:10px;\" id=\""+ id + "_btn3\" class=\"btn btn-success\">Submit</button>";
			
	    	popoverContent += "<div id=\"alertSuccess\" class=\"alert alert-success\" role=\"alert\" style=\"display:none;margin-top:20px;\">Well done! You got the correct answer!</div>";
	    	popoverContent += "<div id=\"alertDanger\" class=\"alert alert-danger\" role=\"alert\" style=\"display:none;margin-top:20px;\">Oh snap! The answer should be \""+sourceWord+"\"!</div>";

			joinString += "  <span ";
			joinString += "class = 'fypSpecialClass' ";
			joinString += "style='text-decoration:underline; font-weight: bold; ' ";
			joinString += "data-placement='above' ";
			joinString += "title='Which of the following is the corresponding English word?' ";
			joinString += "href='#' ";
			joinString += "data-content = '" + popoverContent + "'";
			joinString += "";
			joinString += "";
			joinString += "id = '" + id + "' >";
			joinString += targetWord;
			joinString += "</span>  ";
    	}
		
		$(document).on("click", "#"+id+"_btn1", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
			remembered.get(url_front+'remember?name='+userAccount+'&word='+word+'&is_remembered=1', function(answer) {
			    console.log("this is answer: "+answer);
			});
			$('.fypSpecialClass').popover('hide');
		});

		$(document).on("click", "#"+id+"_btn2", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
	    	$('.fypSpecialClass').popover('hide');
			remembered.get(url_front+'remember?name='+userAccount+'&word='+word+'&is_remembered=0', function(answer) {
			    console.log("this is answer: "+answer);
			});
			window.open("http://dict.youdao.com/search?q="+word+"&keyfrom=dict.index");
		});

		//$(document).on("click", "#"+id+"_btn3", function() {
		$(document).on("click", "input[name*='inlineRadioOptions']", function() {
		//$('input:radio').change(function() {
			//alert("radio changed");
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
			document.getElementById("inlineRadio1").disabled = true;
			document.getElementById("inlineRadio2").disabled = true;
			document.getElementById("inlineRadio3").disabled = true;
			document.getElementById("inlineRadioCorrect").disabled = true;
	    	if(document.getElementById("inlineRadioCorrect").checked == true)
	    	{
				remembered.get(url_front+'remember?name='+userAccount+'&word='+word+'&is_remembered=1', function(answer) {
				    console.log("select the correct answer");
				});
				document.getElementById("alertSuccess").style.display="inline-flex";
				setTimeout(function() {$('.fypSpecialClass').popover('hide')},1000);
			}
			else
			{
				remembered.get(url_front+'remember?name='+userAccount+'&word='+word+'&is_remembered=0', function(answer) {
				    console.log("select the wrong answer");
				});
				document.getElementById("alertDanger").style.display="inline-flex";
				setTimeout(function() {$('.fypSpecialClass').popover('hide')},2500);
			}

			
			//$('.fypSpecialClass').popover('hide');
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

	$('.fypSpecialClass').mouseover(function(){
		$(this).css("color","#FF9900");
		$(this).css("cursor","pointer");
	});
	$('.fypSpecialClass').mouseout(function(){
		$(this).css("color","black");
	});
}


window.addEventListener("load", function(){

    chrome.storage.sync.get(['userAccount', 'isWorking', 'categoryParameter'], function(result){
    	userAccount = result.userAccount;
    	isWorking = result.isWorking;
    	categoryParameter = result.categoryParameter;
    	console.log("user isworking: "+ result.isWorking);
    	console.log("user acc: "+ result.userAccount);
    	console.log("user category: "+ result.categoryParameter);

		if (userAccount == undefined){
			var d = new Date();
			userAccount = "id"+d.getTime()+"_1";
			chrome.storage.sync.set({'userAccount': userAccount});
		}
		
		if(isWorking == undefined)
		{
			isWorking = 0;
			chrome.storage.sync.set({'isWorking': isWorking});
		}
		if(isWorking == 1)
		{
			var paragraphs = document.getElementsByClassName('cnn_storypgraphtxt');

			for (var i = 0; i < paragraphs.length; i++) {

				var sourceWords = [];
				var targetWords = [];

				var stringToServer = paragraphs[i];
				stringToServer = stringToServer.innerHTML;

			    var url = url_front+'show';
			    var params = "text="+stringToServer+"&url="+document.URL+"&name="+userAccount+"&category="+categoryParameter;
			    console.log(params);
			    talkToHeroku(url, params, i);
			}
		}
	});
});