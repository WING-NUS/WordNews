//'use strict';

var userSettings = {
    websiteSetting: [],     // DO NOT USE THIS. Use "settings.websites_to_translate". We cannot be sure that this copy is the latest
    userId: "",
    score: 0,
    rank: 0,
    learnLanguage: "",
    annotationLanguage: "",
    isLoggedIn: false
};

// Store the Tab settings.
var settings = {};

var website;

var rankAccess = { 
                    FREE: 0,
                    VIEW_MACHINE_TRANSLATION: 1, 
                    TAKE_QUIZ : 2, 
                    VIEW_HUMAN_ANNOTATION: 3 ,
                    VOTE_TRANSLATIONS: 4,
                    INPUT_OWN_TRANSLATION: 1
                };

var eventLogger = {};


var paragraphs = [];
var c_paragraphList = [];

var popupDataCont = {};
var translatedWords = {};

var paragraphFormatTag;
var annotationDataCont = {};

var parag_word_idx_array = [];
var popup = null;

var updateUserObj = function ( response ) {
    for (var key in response) {
        userSettings[key] = response[key];
    }
}
function sendMessageToBackground( message, callback ) {
    if (typeof chrome != 'undefined') {
        chrome.runtime.sendMessage( message, callback );
    }
}

userSettings = {
    websiteSetting: 4294967295,
    userId: 1321860684,
    score: 0,
    rank: 4,
    learnLanguage: "zh_CN",
    annotationLanguage: "zh_CN",
    isLoggedIn: false
}

// Android initialization code
function initFromAndroid() {
    console.log('init From Android called.');
    var command = {
        "action": "update_tab",
        "data": {
            "mode": 1,
            "ann_lang": "zh_CN",
            "learn_lang": "zh_CN",
            "wordDisplay": 0,
            "wordsLearn": 1,
            "translationType": "dict",
            "quizType": "lin_distance",
            "websites_to_translate": 4294967295
        }
    }
    onMessageReceived(command);
}

// close popup upon tapping on anywhere else in the page
    $(document).on('click',function(event) {
        var elem = event.target;
        // check if any parent is popup
        while (elem) {
            if(elem.className && (elem.className.includes("gtx-bubble") || elem.className.includes("translate_class"))) {
                return;
            }
            elem = elem.parentNode;
        }
        // not in popup, remove previous popup.
        console.log("removing previous popup");
        $('.gtx-bubble').remove();
    });



if (typeof chrome != 'undefined') {
    console.log('Chrome, initializating with chrome storage.');

    sendMessageToBackground(
        { type: MESSAGE_REQUEST_TYPE_NEW_PAGE, currentURL: window.location.href },
        updateUserObj
    );

//
//    chrome.storage.onChanged.addListener( function(changes, namespace){
//
//        if (namespace == "sync") {
//            for ( var key in changes) {
//                var storageChange = changes[key];
//
//                userSettings[key] = storageChange.newValue;
//            }
//        }
//    })

    //Listener to handle event messages from background.js
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        if ( 'action' in request ) {
            var data = {};
            if ( 'data' in request ) {
                data = request.data;
            }
            switch ( request.action ) {
                case MESSAGE_REQUEST_TYPE_SEND_FB_RECOMMEND:
                    fbSendRecommend();
                    break;
                case MESSAGE_REQUEST_TYPE_UPDATE_TAB_SETTINS:
                    var isDirty = processSettings( data );
                    if ( 'isDirty' in isDirty && isDirty.isDirty == true ) {
                        resetWebsiteView();
                        if ( data.mode == MODE_LOOKUP_LEARN) {
                            for ( var k in WEBSITE_SETTING_ARRAY ) {
                                if ( bTest( data.websites_to_translate, k ) ) {
                                    var website = WEBSITE_SETTING_ARRAY[k];
                                    if (document.URL.indexOf(website) !== -1) {
                                        beginTranslating();
                                    }
                                }
                            }

                        }
                        else if ( data.mode == MODE_LOOKUP_ANNOTATE) {
                            beginAnnotation();
                        }
                        else {
                            // "Disabled" mode
                        }
                    }
                    break;
                case MESSAGE_REQUEST_TYPE_UPDATE_SOURCE_TRANSLATED:
                    var isDirty = processSettings( data );
                    if ( 'isDirty' in isDirty && isDirty.isDirty == true ) {
                        if ( "wordDisplay" in isDirty.prevValueList ) {
                            resetWebsiteView();
                             for (var k in popupDataCont) {
                                 replaceWords(k);
                             }
                            //sortParagraphWordIndexArray( parag_word_idx_array );
                            //replaceWordWithHTML( parag_word_idx_array, generateHTMLForTranslationReplacement, appendTranslationReplacementTextListener );
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    });

} else {
    console.log('Not chrome, waiting for manual initialization.');

    function onMessageReceived( request ) {
        //request = JSON.parse( request );
        console.log( request );
        if ( 'action' in request ) {
            var data = {};
            if ( 'data' in request ) {
                data = request.data;
            }
            switch ( request.action ) {
                case MESSAGE_REQUEST_TYPE_SEND_FB_RECOMMEND:
                    fbSendRecommend();
                    break;
                case MESSAGE_REQUEST_TYPE_UPDATE_TAB_SETTINS:
                    var isDirty = processSettings( data );
                    if ( 'isDirty' in isDirty && isDirty.isDirty == true ) {
                        resetWebsiteView();
                        if ( data.mode == MODE_LOOKUP_LEARN) {
                            for ( var k in WEBSITE_SETTING_ARRAY ) {
                                if ( bTest( data.websites_to_translate, k ) ) {
                                    var website = WEBSITE_SETTING_ARRAY[k];
                                    if (document.URL.indexOf(website) !== -1) {
                                        beginTranslating();
                                    }
                                }
                            }

                        }
                        else if ( data.mode == MODE_LOOKUP_ANNOTATE) {
                            beginAnnotation();
                        }
                        else {
                            // "Disabled" mode
                        }
                    }
                    break;
                case MESSAGE_REQUEST_TYPE_UPDATE_SOURCE_TRANSLATED:
                    var isDirty = processSettings( data );
                    if ( 'isDirty' in isDirty && isDirty.isDirty == true ) {
                        if ( "wordDisplay" in isDirty.prevValueList ) {
                            resetWebsiteView();
                             for (var k in popupDataCont) {
                                 replaceWords(k);
                             }
                            //sortParagraphWordIndexArray( parag_word_idx_array );
                            //replaceWordWithHTML( parag_word_idx_array, generateHTMLForTranslationReplacement, appendTranslationReplacementTextListener );
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }
    console.log('Not chrome, End of manual initialization.');
}

function updateScoreAndRank(score, rank) {
    userSettings.score = score;
    userSettings.rank = rank;
    sendMessageToBackground(
        { type: MESSAGE_REQUEST_TYPE_UPDATE_SCORE_RANK,
              score: score,
              rank: rank
        });
}


function checkRankAndLogin(requiredRank) {
    var NOT_LOGIN = false;
    //TODO: How to even check is it login?
    if (requiredRank > userSettings.rank) {
        //console.log('rank in setting ' + userSettings.rank)
        return USER_RANK_INSUFFICIENT;
    } else if (userSettings.rank >= 4 && userSettings.isLoggedIn) { //IF not login return, -2 to prompt for login
        return USER_NOT_LOGGED_IN;        
    }
    return USER_HAS_ACCESS; //No problem with rank and login
}

var cumulativeOffset = function(element) {

    var top = 0,
        left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };
};

function getURLPostfix(url) {
    var index = url.search('//');
    var noHTTPString = url.substr(index + 2); // this will get the string with http://
    index = noHTTPString.search('/');
    return noHTTPString.substr(index + 1);
}

function unpaintCursor() {
    document.body.style.cursor = "auto";
    $('body').off("mouseup", paragraphFormatTag);
}

function getParagraphsAndClone() {
    var paragraphs = [];

    //If website is cnn
    if (document.URL.indexOf('cnn.com') !== -1) {
        paragraphs = $('.zn-body__paragraph').get();
        paragraphFormatTag = '.zn-body__paragraph';
        website = "cnn";
    }
    //if website is bbc
    else if (document.URL.indexOf('bbc.com') !== -1){
        var article = null;
        var mainContent = null;
        // for most pages like http://www.bbc.com/sport/formula1/37506181
        article = document.getElementById('responsive-story-page');
        // for pages like http://www.bbc.com/future/story/20161003-would-it-be-ethical-to-implant-false-memories-in-therapy
        mainContent = document.getElementsByClassName('primary-content-lining');

        if (article!=null) {
            paragraphs = article.getElementsByTagName('p');
        } else if (mainContent.length>0) {
            paragraphs = mainContent[0].getElementsByTagName('p');
        } else {
            paragraphs = document.getElementsByTagName('p');
        }
        paragraphFormatTag = 'p';
        website = "bbc";
    }
    else { //TODO: Other webpages could be other tags instead of <p>
        paragraphs = document.getElementsByTagName('p');
        paragraphFormatTag = 'p';
        website = "other";
    }

    var clonedParagraphs = [];
    for( var i = 0; i < paragraphs.length; ++i ) {
        clonedParagraphs.push( paragraphs[i].innerText );
    }
    return { "original_parag" : paragraphs, "cloned_parag" : clonedParagraphs };

}

function processSettings( inputSettings ) {
    var isDirty = false;
    var dirtyParamList = {};
    for ( var k in inputSettings ) {
        if ( !( k in settings ) ) {
            // Add any new settings
            dirtyParamList[k] = settings[k];
            settings[k] = inputSettings[k];
            isDirty  = true;
        }
        else if ( settings[k] != inputSettings[k] ) {
            // compare changes & update
            dirtyParamList[k] = settings[k];
            settings[k] = inputSettings[k];
            isDirty  = true;
        }
    }
    return { "isDirty" : isDirty, "prevValueList" : dirtyParamList };
}

function resetWebsiteView() {
    unpaintCursor();
    if ( paragraphs.length == 0 ) {
        var paragraphAndClone = getParagraphsAndClone();
        c_paragraphList = paragraphAndClone.cloned_parag;
        paragraphs = paragraphAndClone.original_parag;

    }

    for (var i = 0; i < paragraphs.length; i++) {
        paragraphs[i].innerHTML = c_paragraphList[i];
    }

    for( var k in annotationDataCont ) {
        var panel = document.getElementById(k+"_popup");
        if ( panel != null ) {
            $(panel).remove()
        }
    }

    for( var k in popupDataCont ) {
        var panel = document.getElementById(k+"_popup");
        if ( panel != null ) {
            $(panel).remove()
        }
    }
    popup=null;

}

//toISOString does not works because date string does not contain timezone information
function formatDate(dateString) {
    var dateObject = new Date(dateString);

    return  dateObject.getFullYear() + "-" +  (dateObject.getMonth() + 1) + "-" + dateObject.getDate();
}

function getArticleTitleAndPublicationDate() {
    var title = document.title;
    var date = "1970-01-01"; //Use unix default timestamp to respresent that it is an old article
    if (website == "bbc") // If website is bbc
    {
        var timestamp;//This variable could either hold the datetime or timestamp
        //There are more than one ways of how the publish timestamp is stored
        var dateElem = document.getElementsByClassName("publication-date index-body");

        if (dateElem.length == 0) { //If the above tag doesnt exist in the webpage
            //Try another tag to get the publish date
            dateElem = document.getElementsByClassName("date date--v2");

            if (dateElem.length > 0) {
                timestamp = dateElem[0].dataset.datetime;
            } else {// If date date--v2 tag does not exist
                //This case is for bbc.com/sport
                dateElem = document.getElementsByClassName("timestamp")[0];
                if(dateElem) {
                    dateElem = dateElem.getElementsByTagName("time")[0];
                    //Convert the timestamp into int because Date() takes in int for timestamp
                    timestamp = (parseInt(dateElem.dataset.timestamp) - 28800) * 1000;
                }
            }
        }
        else {
            //TODO: Need to check again for this case whether the dateset contains datetime
            // timestamp = dateElem[0].dataset.datetime;
            // to capture the date in pages like http://www.bbc.com/future/story/20161003-would-it-be-ethical-to-implant-false-memories-in-therapy
            timestamp = dateElem[0].dataset.datetime || dateElem[0].innerHTML;

        }
        //Format the date to yyyy-mm-dd
        date = formatDate(timestamp);
        console.log(date);
    }
    else if(website == "cnn") { //If website is cnn
        //For cnn, we can get the proper title from this tag
        var titleElem = document.getElementsByClassName("pg-headline");

        if (titleElem.length > 0) {// If the tag exist in the web page
            title = titleElem[0].innerText;
        }
        else { // Else check for another tag for the title
            titleElem = document.getElementsByClassName("article-title"); //This is to cover cnn money
            title = titleElem[0].innerText;
        }


        var dateElem = document.getElementsByClassName("update-time");
        var dateString = "";
        if (dateElem.length > 0) {
            //Format the date to yyyy-mm-dd
            // CNN inner text returns this "Updated 0811 GMT (1611 HKT) August 10, 2016"
            dateString = dateElem[0].innerText;
            var index = dateString.indexOf(")") ;
            dateString = dateString.substr(index + 2);
        }
        else {
            dateElem = document.getElementsByClassName("cnnDateStamp");
            //This tag returns "July 6, 2016: 1:21 AM ET"
            //Need to remove the excessive text behind the time
            dateString = dateElem[0].innerText;
            var index = dateString.indexOf(":") ;
            dateString = dateString.substr(0, index);
        }
        date = formatDate(dateString);
    }
    //For other websites beside cnn and bbc, we will return default values
    return [title, date];
}


function onSendFailure(error) {
    var error_response = $.parseJSON(error.responseText)
    if ( 'msg' in error_response ) {
        notifyError( error_response['msg'] );
    }
}

function notifySuccess( msg, options  ) {
    options = typeof options !== 'undefined' ? options : { globalPosition: 'top left', className: 'success'} ;
    $.notify( msg, options );
}

function notifyError( msg, options ) {
    options = typeof options !== 'undefined' ? options : { globalPosition: 'top left', className: 'error'} ;

    $.notify( msg, options );
}

function populateParagraphWordIndexArray( id, para_idx, word_idx, selected_text ) {
    parag_word_idx_array.push( { id : id, para_idx: para_idx, word_idx: word_idx, selected_text: selected_text } );
}

function sortParagraphWordIndexArray(parag_word_idx_arr) {
    if ( parag_word_idx_arr.length > 0 ) {
        parag_word_idx_arr.sort(function(a,b) {
            return a.para_idx - b.para_idx || b.word_idx - a.word_idx;
        });
    }
}

function replaceWordWithHTML( parag_word_idx_arr, generateHTML, appendListener ) {
    if ( parag_word_idx_arr.length <= 0 ) {
        return;
    }

    for( var j = 0; j < parag_word_idx_arr.length; j++ ) {
        var data = parag_word_idx_arr[j];
        if (paragraphs.length < data.para_idx) {
            console.log("layout changed");
            continue;
        }

        var para = paragraphs[data.para_idx];
        var innerHtml = para.innerHTML;
        //console.log(para);

        var testText = innerHtml.slice(data.word_idx, data.word_idx+data.selected_text.length);
        if ( testText == data.selected_text ) {
            // text found
            var before = innerHtml.slice(0, data.word_idx);
            var after = innerHtml.slice(data.word_idx + data.selected_text.length);

            //Create <span> HTML tag and add to the middle
            var html = generateHTML( data.id );
            para.innerHTML = before + html + after;
            appendListener = typeof appendListener !== 'undefined' ? appendListener : null;
            if ( appendListener != 'undefined' ){
                appendListener(data.id);
            }
        }
    }
}

//
//
////Window event to check whether window is focused
//$(window).on("blur focus", function(e) {
//    var prevType = $(this).data("prevType");
//
//    if (prevType != e.type) {   //  reduce double fire issues
//        switch (e.type) {
//            case "blur":
//                console.log("Blured");
//                //Loop through the all the events and add no focus event
//                for (var key in eventLogCont) {
//                    newEvent(key, "no focus");
//                }
//
//                break;
//            case "focus": //Update the chrome UI
//                console.log("Focused")
//                sendMessageToBackground(
//                    {type: MESSAGE_REQUEST_TYPE_TAB_ACTIVE, value: true},
//                    updateUserObj
//                );
//                break;
//        }
//    }
//
//    $(this).data("prevType", e.type);
//});
//
//$(document).mouseup(function (e) {
//    if ( popup != null ) {
//        var elem = $( "#" + popup );
//        var displayID = popup + "_popup";
//        var myElem = $("#" + displayID);
//        if ( elem != null && myElem != null ) {
//            if (!elem.is(e.target) && !myElem.is(e.target) && myElem.has(e.target).length == 0) {
//                myElem.trigger("onRemove");
//                myElem.remove();
//                popup = null;
//            }
//        }
//    }
//});