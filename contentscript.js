'use script';

var url_front = "http://testnaijia.herokuapp.com/";
//var url_front = "http://localhost:3000/";


var userAccount = "";
var isWorking = "";
var categoryParameter = "";
var wordDisplay = "";
var wordsReplaced = "";
var pageDictionary = {};
var vocabularyListDisplayed;

function talkToHeroku(url, params, index){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //console.log("here");
    
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            //console.log("here?");

            var response = xhr.responseText.replace(/&quot;/g,'"');
            var obj=JSON.parse(response);
            console.log(obj);
            
            var sourceWords = [];
            var targetWords = [];
            var isTest = [];
            var pronunciation = [];
            var choices1 = [];
            var choices2 = [];
            var choices3 = [];
            var wordID = [];
            var count = 0;
            for (var x in obj) {
            	if(count >= wordsReplaced){
            		count++;
            		continue;
				}
				count++;
				sourceWords.push(x);
				targetWords.push(obj[x].chinese);
				isTest.push(obj[x].isTest);
				pageDictionary[x] = obj[x].chinese;

				if(obj[x].pronunciation !== undefined){
					pronunciation.push(obj[x].pronunciation);
				}
				else{
					pronunciation.push("/pronunciation/");
				}

				if(obj[x].wordID !== undefined){
					wordID.push(obj[x]["wordID"]);
				}
				else{
				}

				if(obj[x].isTest == 1 || obj[x].isTest == 2){
					choices1.push(obj[x]["choices"]["0"]);
					choices2.push(obj[x]["choices"]["1"]);
					choices3.push(obj[x]["choices"]["2"]);
					//console.log("other english is : "+obj[x]["choices"]["2"]);
				}
				else{
					choices1.push(" ");
					choices2.push(" ");
					choices3.push(" ");
				}
				//console.log(x+" "+obj[x]+" "+obj[x].isTest);
			}
			replaceWords(sourceWords, targetWords, isTest, pronunciation, wordID, choices1, choices2 , choices3, index);
            //document.getElementById('article').innerHTML  = obj["chinese"];
        }
        else {// Show what went wrong
            //document.getElementById('article').innerHTML  = "Something Went Wrong";
        }
    }
    xhr.send(params);
}


function replaceWords(sourceWords, targetWords, isTest, pronunciation, wordID, choices1, choices2 , choices3, i){

	var paragraphs = document.getElementsByClassName('zn-body__paragraph');

	for(var j = 0;j < sourceWords.length; j++){

		var sourceWord = sourceWords[j];
		var targetWord = targetWords[j];

    	var paragraph = paragraphs[i];
    	var text = paragraph.innerHTML;

		//var id = "myID_"+sourceWord+"_"+targetWord+"_"+i.toString();
		var id = "myID_"+sourceWord+"_"+wordID[j]+"_"+i.toString();

		//console.log(id);

		var popoverContent = "";
		var joinString = "";
		pronunciation[j] = pronunciation[j].replace("5","");
		if(isTest[j] == 0){

			popoverContent += "<div sytle=\"text-align:center;\">";
			popoverContent += "<div>Pronunciation: <div style=\"margin-left:10px\">";

			var splitedPinyin = pronunciation[j].split(" ");
			var chineseCharactors = targetWord.replace("(","").replace(")","").split("");

			for(var k = 0; k < splitedPinyin.length; k++){
				popoverContent += chineseCharactors[k]+splitedPinyin[k];
				popoverContent += "<img src=\"http://emergingmoney.com/wp-content/uploads/2011/11/audio.gif\" style=\"width:15px;height:15px\" class=\"audioButton\" id=\""+splitedPinyin[k]+"\"> "
        		popoverContent += "<audio id=\"myAudio_"+splitedPinyin[k]+"\">"
				popoverContent += "<source src=\"http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/"+splitedPinyin[k]+".mp3\" type=\"audio/mp3\">";
				popoverContent += "</audio>";
			}

			popoverContent += "</div></div>";

/*			for(var k = 0; k < englishSentence[j].length; k++)
				popoverContent += "<div>englishSentence: <div style=\"margin-left:10px\">"+englishSentence[j][k]+"\n"+chineseSentence[j][k]+"</div></div>";
	    	*/
			//popoverContent += "<div>englishSentence: <div style=\"margin-left:10px\">This is exmaple sentence.</div></div>";
			popoverContent += "<a id=\""+ id + "_btn3\" >Click_to_get_example_sentences:</a>";
	    	popoverContent += "<div id=\"exampleSentences\" style=\"display:none;margin-bottom:10px;\"></div>"

	    	popoverContent += "<div ><button id=\""+ id + "_btn1\" class=\"btn btn-info\">Got it</button>";
	    	popoverContent += "<button style=\"margin-left:10px\" id=\""+ id + "_btn2\" class=\"btn btn-warning\">Show me</button></div>";
    		popoverContent += "</div>";

    		joinString += "  <span ";
			joinString += "class = 'fypSpecialClass' ";
			joinString += "style='text-decoration:underline; font-weight: bold; ' ";
			joinString += "data-placement='above' ";
			if(wordDisplay == 1)
				joinString += "title='"+ "<span style=\"font-weight: bold;  font-size:150%;\">" + targetWord + "</span>' ";
			else
				joinString += "title='"+ "<span style=\"font-weight: bold;  font-size:150%;\">" + sourceWord + "</span>' ";
			joinString += "href='#' ";
			joinString += "data-content = '" + popoverContent + "'";
			joinString += "id = '" + id + "' >";
			if(wordDisplay == 1)
				joinString += sourceWord;
			else
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
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio1\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices1[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 2:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio2\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices2[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 3:
						popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio3\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices3[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 4:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadioCorrect\" value=\""+wordID[j]+"\">";
			    		if(isTest[j] == 1)
			    			popoverContent += sourceWord;
			    		else if(isTest[j] == 2)
			    			popoverContent += targetWord;
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
	    	if(isTest[j] == 2)
	    		popoverContent += "<div id=\"alertDanger\" class=\"alert alert-danger\" role=\"alert\" style=\"display:none;margin-top:20px;\">Oh snap! The answer should be \""+targetWord+"\"!</div>";
	    	else
	    		popoverContent += "<div id=\"alertDanger\" class=\"alert alert-danger\" role=\"alert\" style=\"display:none;margin-top:20px;\">Oh snap! The answer should be \""+sourceWord+"\"!</div>";
			joinString += "  <span ";
			joinString += "class = 'fypSpecialClass' ";
			joinString += "style='text-decoration:underline; font-weight: bold; ' ";
			joinString += "data-placement='above' ";
    		if(isTest[j] == 1)
				joinString += "title='Which of the following is the corresponding English word?' ";
			else
				joinString += "title='Which of the following is the corresponding Chinese word?' ";
			joinString += "href='#' ";
			joinString += "data-content = '" + popoverContent + "'";
			joinString += "id = '" + id + "' >";
			if(isTest[j] != 2)
				joinString += targetWord;
			else
				joinString += sourceWord;
			joinString += "</span>  ";
    	}

		$(document).on("click", "#"+id+"_btn1", function() {
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    console.log(tempWordID);
	    	var remembered = new HttpClient();
			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
			    console.log("this is answer: "+answer);
			});
			$('.fypSpecialClass').popover('hide');
		});


		$(document).on("click", "#"+id+"_btn2", function() {
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    //console.log(tempWordID);
	    	var remembered = new HttpClient();
	    	$('.fypSpecialClass').popover('hide');
			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
			    console.log("this is answer: "+answer);
			});
			window.open("http://dict.youdao.com/search?q="+englishWord+"&keyfrom=dict.index");
		});

		$(document).on("click","#"+id+"_btn3",function(){
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    //console.log(tempWordID);
			var remembered = new HttpClient();
		    remembered.get(url_front+'getExampleSentences?name='+userAccount+'&wordID='+tempWordID, function(answer) {
				var obj=JSON.parse(answer);
				console.log(obj);
				var exampleSentences = "";

				if(obj.englishSentence !== undefined && obj.chineseSentence !== undefined){
					var tempEnglishSentence = [];
					for(var key in obj.englishSentence){
						exampleSentences += "<div>"+obj.englishSentence[key]+"</div>";
						exampleSentences += "<div>"+obj.chineseSentence[key]+"</div>";
						console.log("from server: "+exampleSentences);
					}
				}
				else{
					console.log("englishSentence or chineseSentence is not defined!!!");
				}

				if(exampleSentences == ""){
					exampleSentences += "<div>Sorry. No example sentence available for this word.</div>";
					exampleSentences += "<div>You can click \"show me\" for more info.</div>";
				}
				document.getElementById('exampleSentences').innerHTML = exampleSentences;
				document.getElementById("exampleSentences").style.display="table";

			});
			//document.getElementById('exampleSentences').innerHTML = "This is a book. 是一本...";
		});

		//$(document).on("click", "#"+id+"_btn3", function() {
		$(document).on("click", "input[name*='inlineRadioOptions']", function() {
		//$('input:radio').change(function() {
			//alert("radio changed");
			var id = $(this).attr('id');
		    var tempWordID = $(this).attr('value').split("_")[0];
			//console.log("word = "+word+" id = "+id);
	    	var remembered = new HttpClient();
			document.getElementById("inlineRadio1").disabled = true;
			document.getElementById("inlineRadio2").disabled = true;
			document.getElementById("inlineRadio3").disabled = true;
			document.getElementById("inlineRadioCorrect").disabled = true;
	    	if(document.getElementById("inlineRadioCorrect").checked == true)
	    	{
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
				    console.log("select the correct answer");
				});
				document.getElementById("alertSuccess").style.display="inline-flex";
				setTimeout(function() {$('.fypSpecialClass').popover('hide')},1000);
			}
			else
			{
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
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
    	console.log("paragraph.length is: "+paragraphs.length+" and i is:"+i);
    	if(i == paragraphs.length-1 && vocabularyListDisplayed == 0){
    		vocabularyListDisplayed = 1;
    		console.log("wowowowowowowowowowowow");
    		var oneMoreParagraph = "<p></p><p></p>";
			oneMoreParagraph+="<p style='font-weight: bold;'>Words translated in this page:</p>";
			//console.log("size of the dictionary is: "+ Object.keys(pageDictionary).length);
			var key;
			for(key in pageDictionary){
				oneMoreParagraph+="<p>"+key+" : "+pageDictionary[key]+"</p>";
			}
			$(oneMoreParagraph).insertAfter(".cnn_storypgraph"+(i+2));
/*			oneMoreParagraph+="<p style='font-weight: bold;'>Here are some links that you might be interested:</p>";

			//http://testnaijia.herokuapp.com/getSuggestURL?name='+userAccount'
			var remembered = new HttpClient();
		    remembered.get(url_front+'getSuggestURL?name='+userAccount, function(answer) {

				var obj=JSON.parse(answer);
				console.log(obj);

				oneMoreParagraph += "<p><a target='_blank' href='"+obj.url+"'>"+obj.url+"</a></p>";
				
			});*/
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

	$('.fypSpecialClass').popover({ html : true, placement : 'bottom', trigger: 'click hover', delay: {show: 300, hide: 300}});

	$('.fypSpecialClass').mouseover(function(){
		$(this).css("color","#FF9900");
		$(this).css("cursor","pointer");
	});
	$('.fypSpecialClass').mouseout(function(){
		$(this).css("color","black");
	});
}


window.addEventListener("load", function(){
	vocabularyListDisplayed = 0;
    chrome.storage.sync.get(null, function(result){

    	var allKeys = Object.keys(result);
    	console.log(allKeys);

    	userAccount = result.userAccount;
    	isWorking = result.isWorking;
    	wordDisplay = result.wordDisplay;
    	wordsReplaced = result.wordsReplaced;

    	console.log("user acc: "+ result.userAccount);
    	console.log("user isWorking: "+ result.isWorking);
    	console.log("user wordDisplay: "+ result.wordDisplay);
    	console.log("user wordsReplaced: "+ result.wordsReplaced);

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

		if(wordDisplay == undefined){
			wordDisplay = 0;
			chrome.storage.sync.set({'wordDisplay': wordDisplay});
		}

		if(wordsReplaced == undefined){
			wordsReplaced = 0;
			chrome.storage.sync.set({'wordsReplaced': wordsReplaced});
		}

		var remembered = new HttpClient();
		//http://testnaijia.herokuapp.com/getIfTranslate?name='+userAccoun
/*		remembered.get(url_front+'getIfTranslate?name='+userAccount, function(answer) {

            var obj=JSON.parse(answer);

            if(obj.if_translate!==undefined){
            	if(obj.if_translate=='1')
            		isWorking = 1;
            	else
           			isWorking = 0;
            }*/

        if(isWorking == 1)
        {
			var paragraphs = document.getElementsByClassName('zn-body__paragraph');

			for (var i = 0; i < paragraphs.length; i++) {
				//console.log("length of the paragraphs is : "+paragraphs.length);
				var sourceWords = [];
				var targetWords = [];

				var stringToServer = paragraphs[i];
				stringToServer = stringToServer.innerHTML;

			    var url = url_front+'show';
			    var params = "text="+stringToServer+"&url="+document.URL+"&name="+userAccount;
			    //console.log(params);
			    talkToHeroku(url, params, i);
			}
			
			$(document).on("click", ".audioButton", function() {
				var id = $(this).attr('id');
				console.log("clicked id is "+id);
				var myAudio = document.getElementById("myAudio_"+id);
				if (myAudio.paused) {
					//console.log("find this element and it is paused");
					myAudio.play();
				} else {
					myAudio.pause();
				}
	  		});

		}

		//});
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