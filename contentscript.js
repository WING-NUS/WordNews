'use script';

var url_front = "http://testnaijia.herokuapp.com/";
//var url_front = "http://localhost:3000/";


var userAccount;
var isWorking;
var categoryParameter;
var pageDictionary = {};


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
            var pronunciation = [];
            var example_sentence = [];
            var choices1 = [];
            var choices2 = [];
            var choices3 = [];
            for (var x in obj) {
				sourceWords.push(x);
				targetWords.push(obj[x].chinese);
				is_test.push(obj[x].is_test);
				pageDictionary[x] = obj[x].chinese;
				if(obj[x].pronunciation !== undefined){
					pronunciation.push(obj[x].pronunciation);
				}
				else{
					pronunciation.push("/pronunciation/");
				}
				if(obj[x].example_sentence !== undefined){
					example_sentence.push(obj[x].example);
				}
				else{
					example_sentence.push("/Here is aaaaaaaaaa aaaaaaaa aaaaaaaaaa aaaaaa a aaaaa aaaaaaaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaaa aaa a a aaaaaaa aaa aaa aaaaaa aaaa aaa aaaa aaa aaaaa aaa aa a aa aa example_sentence./");
				}
				if(obj[x].is_test == 1){
					choices1.push(obj[x]["choices"]["0"]);
					choices2.push(obj[x]["choices"]["1"]);
					choices3.push(obj[x]["choices"]["2"]);
					console.log("other english is : "+obj[x]["choices"]["2"]);
				}
				else{
					choices1.push(" ");
					choices2.push(" ");
					choices3.push(" ");
				}
				console.log(x+" "+obj[x]+" "+obj[x].is_test);
			}
			replaceWords(sourceWords, targetWords, is_test, pronunciation, example_sentence, choices1, choices2 , choices3, index);
            //document.getElementById('article').innerHTML  = obj["chinese"];
        }
        else {// Show what went wrong
            //document.getElementById('article').innerHTML  = "Something Went Wrong";
        }
    }
    xhr.send(params);
}


function replaceWords(sourceWords, targetWords, is_test, pronunciation, example_sentence, choices1, choices2 , choices3, i){

	var paragraphs = document.getElementsByClassName('cnn_storypgraphtxt');

	for(var j = 0;j < sourceWords.length; j++){

		var sourceWord = sourceWords[j];
		var targetWord = targetWords[j];

    	var paragraph = paragraphs[i];
    	var text = paragraph.innerHTML;

		var id = "myID_"+sourceWord+"_"+i.toString();
		console.log(id);

		var popoverContent = "";
		var joinString = "";
		if(is_test[j] == 0)
		{
			popoverContent += "<div sytle=\"text-align:center;\">";
			popoverContent += "<div>Pronunciation: <div style=\"margin-left:10px\">"+pronunciation[j]+"</div></div>";
			popoverContent += "<div>Example_sentence: <div style=\"margin-left:10px\">"+example_sentence[j]+"</div></div>";
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
    		if(is_test[j] == 2)
    		{
    			var tempWord = targetWord;
    			targetWord = sourceWord;
    			sourceWord = tempWord;
    		}

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
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio1\" value=\""+sourceWord+"\">";
			    		popoverContent += choices1[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 2:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio2\" value=\""+sourceWord+"\">";
			    		popoverContent += choices2[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 3:
						popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio3\" value=\""+sourceWord+"\">";
			    		popoverContent += choices3[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 4:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadioCorrect\" value=\""+sourceWord+"\">";
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
    		if(is_test[j] == 1)
				joinString += "title='Which of the following is the corresponding English word?' ";
			else
				joinString += "title='Which of the following is the corresponding Chinese word?' ";
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
		    var word = $(this).attr('value');
			console.log("word = "+word+" id = "+id);
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

    	if(i == paragraphs.length-1){

    		var oneMoreParagraph = "<p></p><p></p>";
			oneMoreParagraph+="<p style='font-weight: bold;'>Words translated in this page:</p>";
			//console.log("size of the dictionary is: "+ Object.keys(pageDictionary).length);
			var key;
			for(key in pageDictionary){
				oneMoreParagraph+="<p>"+key+" : "+pageDictionary[key]+"</p>";
			}

			oneMoreParagraph+="<p calss='cnn_storypgraph"+(i+3)+"' style='font-weight: bold;'>Here are some links that you might be interested:</p>";
			$(oneMoreParagraph).insertAfter(".cnn_storypgraph"+(i+2));
		}
	}



	var originalLeave = $.fn.popover.Constructor.prototype.leave;
	$.fn.popover.Constructor.prototype.leave = function(obj){
		var self = obj instanceof this.constructor ?
		obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
		var container, timeout;

		originalLeave.call(this, obj);

		if(obj.currentTarget) {
			container = $(obj.currentTarget).siblings('.popover')
			timeout = self.timeout;
			container.one('mouseenter', function(){
				//We entered the actual popover – call off the dogs
				clearTimeout(timeout);
				//Let's monitor popover content instead
				container.one('mouseleave', function(){
					$.fn.popover.Constructor.prototype.leave.call(self, self);
				});
			})
		}
	};

	$('.fypSpecialClass').popover({ html : true, placement : 'bottom', trigger: 'click hover', delay: {show: 50, hide: 400}});

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
		var remembered = new HttpClient();
		//http://testnaijia.herokuapp.com/getIfTranslate?name='+userAccoun
		remembered.get(url_front+'getIfTranslate?name='+userAccount, function(answer) {

            var obj=JSON.parse(answer);
            console.log(obj);

            if(obj.if_translate!==undefined){
            	if(obj.if_translate=='1')
            		isWorking = 1;
            	else
           			isWorking = 0;
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
		    //http://testnaijia.herokuapp.com/getSuggestURL?name='+userAccount'
		    remembered.get(url_front+'getSuggestURL?name='+userAccount, function(answer) {

				var obj=JSON.parse(answer);
				console.log(obj);
				var suggestedURL = "<p><a target='_blank' href='"+obj.url+"'>"+obj.url+"</a></p>";
				$(suggestedURL).insertAfter(".cnn_storypgraph"+(i+3));
			});
		});
	});
});


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