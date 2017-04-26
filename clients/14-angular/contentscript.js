'use script';

var userAccount = localStorage["userAccount"];

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
    	popoverContent += "<button id=\""+ id + "_btn1\" class=\"btn btn-info\">I got it.</button>";
    	popoverContent += "<span>    </span>"
    	popoverContent += "<button id=\""+ id + "_btn2\" class=\"btn btn-warning\">Really??</button>";

		var joinString = "";
		joinString += "  <button ";
		//joinString += "class='btn btn-default' ";
		//joinString += "style = 'padding: 1x 0px;' ";
		joinString += "data-placement='above' ";
		joinString += "title='"+ "Translated from: <span style=\"font-weight: bold;  font-size:150%;\">" + sourceWord + "</span>' ";
		joinString += "href='#' ";
		joinString += "data-content = '" + popoverContent + "'";
		joinString += "";
		joinString += "";
		joinString += "id = '" + id + "' >";
		joinString += targetWord;
		joinString += "</button>  ";
		//console.log(joinString);

		$(document).on("click", "#"+id+"_btn1", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
			remembered.get('http://localhost:3000/curl_example?author='+userAccount+'&word='+word+'&is_remebered=1', function(answer) {
			    console.log("this is answer: "+answer);
			});
		});

		$(document).on("click", "#"+id+"_btn2", function() {
			var id = $(this).attr('id');
		    var word = id.split('_')[1];
	    	var remembered = new HttpClient();
			remembered.get('http://localhost:3000/curl_example?author='+userAccount+'&word='+word+'&is_remebered=2', function(answer) {
			    console.log("this is answer: "+answer);
			});
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

	$('button').popover({ html : true});

	$('button').click(function(){
  		var currentId = $(this).attr('id');
  		console.log(currentId);
  		if(currentId.indexOf('myID_') > -1 && (!currentId.indexOf('_btn') > -1)){
			$(this).popover({
				trigger : 'focus',
				html : true,
			    content: function() {
			      return $('#popover_content_wrapper').html();
			    }
			});
			//$(this).popover('show');
  		}
  		else if(currentId.indexOf('myID_') > -1 && currentId.indexOf('_btn') > -1){
  			
  			if(currentId.indexOf('_btn1') > -1){

  			}
  			else if(currentId.indexOf('_btn2') > -1){
  				var notRemembered = new HttpClient();
				notRemembered.get('http://localhost:3000/curl_example?author='+userAccount+'&word='+sourceWord+'&is_remebered=2', function(answer) {
				    console.log("this is answer: "+answer);
				});
  			}
  		}
	});
}


window.addEventListener("load", function(){


	if (userAccount == undefined){
		userAccount = "id2014072023152230_0";
	}


	//var app = angular.module('fyp',[]);

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


});