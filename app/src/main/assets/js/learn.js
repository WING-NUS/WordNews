'use strict';

function fbSendRecommend() {
    sendFBRecommend( userSettings.userId, 1, userSettings.learnLanguage, window.location.href,
        function(result) {
            //console.log(JSON.stringify(result));
            notifySuccess( "Share successful" );
        },
        function(error) {
            //console.log("Request for fb post recommend.");
            //alert(error.responseText);
            notifyError("Share unsuccessful");
        }
    );
}

function onSuccessUpdateScore(result) {
    if ( 'user' in  result ) {
        updateScoreAndRank(result.user.score, result.user.rank)
    }
}

function onVoteFailureUpdateScore(error) {
    var error_response = $.parseJSON(error.responseText)
    if ( 'msg' in error_response ) {
        notifyError( error_response['msg'] );
    }
}

function generateHTMLForQuiz(word, translatedWord, popupID, quiz) {

    // Append answer to last.
    var html ='<div></div>';
    if ('choices' in quiz ) {
        quiz.choices[3]=word;
        var arrayShuffle = shuffle([0, 1, 2, 3]);
        html = '<div tabindex="-1" id=\"' + popupID + '_popup\" class="jfk-bubble gtx-bubble" style="visibility: visible;  opacity: 1; padding-bottom: 40px; ">';
        html += '<a href="#" style="position: absolute; right: 8px;" id=\"' + popupID + '_close">X</a>';
        html += '<div class="jfk-bubble-content-id"><div id="gtx-host" style="min-width: 200px; max-width: 400px;">';
        html += '<div id="bubble-content" style="min-width: 200px; max-width: 400px;" class="gtx-content">';
        html += '<div id="translation" style="min-width: 200px; max-width: 400px; display: inline;">';
        var userAccess = checkRankAndLogin(rankAccess.TAKE_QUIZ);
        if (userAccess == USER_HAS_ACCESS) {

            html += '<div style="font-size: 80%;" class="gtx-language">Choose the most appropriate translation:</div>';

            for (var i = 0; i < arrayShuffle.length; ++i) {
                //Append div tag
                if (i == 0 || i == 2) {
                    html += '<div style="width: 100%;">';
                }

                var num = arrayShuffle[i];

                html += '<div id="quiz_' + popupID + '_' + i + '" align="center"' +
                    //'onMouseOver="this.style.color=\'#FF9900\'"' +
                    //'onMouseOut="this.style.color=\'#626262\'" '+
                    'style="font-weight: bold;' +
                    'cursor:pointer; color: #626262; float: left; width: 50%; padding-top:' +
                    '16px;">' + quiz.choices[num] + '</div>';

                //Append the end of div tag
                if (i == 1 || i == 3) {
                    html += "</div>";
                }
            }
        } else {
            html += '<div style="font-size: 80%;" class="gtx-language">You do not have enough rank to do quiz.</div>';
        }

        html += '</div></div></div></div>';
        html += '<div class="jfk-bubble-arrow-id jfk-bubble-arrow jfk-bubble-arrowup" style="left: 117px;">';
        html += '<div class="jfk-bubble-arrowimplbefore"></div>';
        html += '<div class="jfk-bubble-arrowimplafter"></div></div></div>';
        return html;
    }
    else {
        return html;
    }
}

function generateVotingHTML(popupID, word, wordElem) {
    var html = '<div>Is the translation accurate?</div>';
    html += '<button type="button" class="btn btn-success btn-sm" id="vote_yes_button_' + popupID + '" data-pair_id="' + wordElem.id + '" data-source="' + wordElem.source + '" style="margin-right:10px">Yes</button>';
    html += '<button type="button" class="btn btn-success btn-sm" id="vote_no_button_' + popupID + '" data-pair_id="' + wordElem.id + '" data-source="' + wordElem.source + '">No</button>';
    html += '</div><br>';

    return html;
}

//This function takes in id and wordElem and generate html for view popup
function generateHTMLForViewPopup(popupID, word, wordElem) {
    var html = '<div tabindex="-1" id="' + popupID + '_popup" class="jfk-bubble gtx-bubble" style="visibility: visible;  opacity: 1;">';
    html += '<a href="#" style="position: absolute; right: 8px;" id=\"' + popupID + '_close">X</a>';
    html += '<div class="jfk-bubble-content-id"><div id="gtx-host" style="min-width: 200px; max-width: 400px;">';
    html += '<div id="bubble-content" style="min-width: 200px; max-width: 400px;" class="gtx-content">';
    html += '<div class="content" style="border: 0px; margin: 0">';
    html += '<div id="translation" style="min-width: 200px; max-width: 400px; display: inline;">';
    //TODO: Language is hardcoded
    html += '<div class="gtx-language">ENGLISH</div>';
    html += '<div class="gtx-body" style="padding-left:21px;">' + word + '</div><br>';
    //TODO: Language is hardcoded
    html += '<div class="gtx-language">CHINESE (SIMPLIFIED)</div>';

    html += '<div>';
    html += '<input type="image" class="audio-button" id="btn_audio_' + popupID + '" style="height:21px;width:21px;display:inline-block;opacity:0.55;vertical-align:middle;background-size:91%;-webkit-user-select: none;-webkit-font-smoothing: antialiased;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAACjSURBVDjLY2AYYmA1QwADI3FKy8HkfyA8zqBOjPL/YLqO4SWQ9YXBmbDy/1C2EMMGsBZNQsr/w/lMDCuAvKOElP+HeloQSPIxPAPynVAV/seAENHtYLoKyJpDnIb/DOZA2gBI3yRWQx6Q5gZ7nFYaQE4yJN5JW8B0PaanYaADRcMaBh5wsD7HDFZMLURGHEIL0UkDpoWExAfRQlLyJiMDDSAAALgghxq3YsGLAAAAAElFTkSuQmCC" >'

    html += '<audio id="pronunciation_audio_' + popupID + '">';
    html += '</audio>';

    html += '<select id = "translatedSelect_' + popupID + '" style="font-size:16px; margin-right:5px"> </select>'; //translatedCharacters;            

    html += '<small id="pronunciation_' + popupID + '">' + wordElem.pronunciation + '</small> ';
    html += '</div><br>';

    html += '<div id ="vote_translation_' + popupID + '">';
    html += '</div>';
    
    html += '<div id="textarea_' + popupID + '" >Input: ';
    html += '<input type="text" id="translated_text_input_' + popupID + '" style="border:1px solid black;"><br>';
    html += '<button type="button" class="btn btn-success btn-sm" id="vote_submit_button_' + popupID + '"  >Submit</button>';          
    html += '</div>';
    
    var see_more_id = "more_" + popupID;
    html += '<a id="' + see_more_id + '" target="_blank" class="More" href="' + wordElem.more_url + '" style="color: #A2A2A2; float: right; padding-top: 16px;">MORE »</a>';

    html += '</div></div></div></div></div>';
    html += '<div class="jfk-bubble-arrow-id jfk-bubble-arrow jfk-bubble-arrowup" style="left: 117px;">';
    html += '<div class="jfk-bubble-arrowimplbefore"></div>';
    html += '<div class="jfk-bubble-arrowimplafter"></div></div></div>';

    return html;
}

function generateHTMLForTranslationReplacement( popupID ) {

    if( typeof popupDataCont[popupID] === 'undefined') {
        return ' ';
    }

    var popupData = popupDataCont[popupID];

    var joinString = '';
    joinString += '<span class="translate_class" style="text-decoration: underline; font-weight: bold;" data-placement="above" ';
    joinString += 'title="';

    // Invert of what is selected. If user choose original text, embed translation to tooltip, vice verse
    if (settings.wordDisplay == WORD_DISPLAY_SHOW_ORIGINAL) {
        if ( popupData.type == 0) {
            joinString += popupData.machine_translate;
        }
        else {
            joinString += popupData.word;
        }
    } else {
        joinString += popupData.word;
    }
    joinString += '" ';


    joinString += 'id = "' + popupID + '" >';

    if (settings.wordDisplay == WORD_DISPLAY_SHOW_ORIGINAL) {
        joinString += popupData.word;
    } else {
        if ( popupData.type == 0) {
            joinString += popupData.machine_translate;
        }
        else {
            // This is a quiz so show original word.
            joinString += popupData.word;
        }
    }

    joinString += '</span> ';

    return joinString
}

function playAudio(audioElem) {
    console.log("play " + audioElem.id);
    //Get audio sources from element
    var audioSources = audioElem.getElementsByTagName("source");
    var index = 1;

    //This function will auto loop to play the next track until the last one and reset it back to 0
    var playNext = function() {
        if (index < audioSources.length) {
            audioElem.src = audioSources[index].src;
            index += 1;
            // use timeout to prevent The play() request was interrupted by a call to pause() error
            setTimeout(function() {
                audioElem.play();
            }, 10);
        } else {
            //Reset back to first audio source
            audioElem.src = audioSources[0].src;
            audioElem.pause();
            index = 1;
        }
    };
    //Add event for end of audio play to play next track
    audioElem.addEventListener('ended', playNext);
    audioElem.src = audioSources[0].src;
    setTimeout(function() {
        audioElem.play();
    }, 10);
}

function appendTranslationReplacementTextListener( popupID ) {
    if( typeof popupDataCont[popupID] === 'undefined') {
        return;
    }
    var popupData = popupDataCont[popupID];

    $(document).off('click.wordnews', "#"+popupID ).on('click.wordnews', "#"+popupID,"#"+popupID, (popupData.type == 0)  ? appendPopUp : appendQuizPopup );

    $(document).on( 'mouseover', "#"+popupID, function() {
        //$(this).tooltip('show');
        $(this).css("color", "#FF9900");
        $(this).css("cursor", "pointer");
    });

    $(document).on( 'mouseout', "#"+popupID, function() {
        //$(this).tooltip('hide');
        $(this).css("color", "black");
    });
}

 function replaceWords( popupID ) {

     if( typeof popupDataCont[popupID] === 'undefined') {
         return
     }

     var popupData = popupDataCont[popupID];

     var paragraph = paragraphs[popupData.paragraphIndex];
     var text = paragraph.innerHTML;

     var joinString = '';

     joinString += '<span ';
     joinString += 'class = "translate_class" ';
     joinString += 'style="text-decoration:underline; font-weight: bold; "';
     joinString += 'data-placement="above" ';
     joinString += 'title="';

     // Invert of what is selected. If user choose original text, embed translation to tooltip, vice verse
     if (settings.wordDisplay == WORD_DISPLAY_SHOW_ORIGINAL) {
         if ( popupData.type == 0) {
             joinString += popupData.machine_translate;
         }
         else {
             joinString += popupData.word;
         }
     } else {
         joinString += popupData.word;
     }
     joinString += '" ';


     joinString += 'id = "' + popupID + '" >';

     if (settings.wordDisplay == WORD_DISPLAY_SHOW_ORIGINAL) {
         joinString += popupData.word;
     } else {
         if ( popupData.type == 0) {
             joinString += popupData.machine_translate;
         }
         else {
             // This is a quiz so show original word.
             joinString += popupData.word;
         }
     }

     joinString += '</span> ';

     var parts = text.split(new RegExp('\\b' + popupData.word + '\\b'));
     var result = '';
     if (parts.length > 1) {
         var n = occurrences(parts[0], '\"');
         result += parts[0] + joinString;
         parts.splice(0, 1);
     }

     result += parts.join(' ' + popupData.word + ' ');

     //Create the inner html for highlighted/underlined translated text
     paragraph.innerHTML = result;

     // There is a bug where events don't get attached to newly created elements.
     // Solution: Attach to a delegate e.g. $(document)
     // From -> Event binding on dynamically created elements? - http://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements

     $(document).off('click.wordnews', "#"+popupID ).on('click.wordnews', "#"+popupID, (popupData.type == 0)  ? appendPopUp : appendQuizPopup );

     //$(document).on( 'mouseover', "#"+popupID, function() {
     //   $(this).tooltip('show');
     //   $(this).css("color", "#FF9900");
     //   $(this).css("cursor", "pointer");
     //});
     //
     //$(document).on( 'mouseout', "#"+popupID, function() {
     //    $(this).tooltip('hide');
     //    $(this).css("color", "black");
     //});

 }

function processTranslationResult( wordsCont, parag_word_idx_arr ) {

    for (var i = 0; i < wordsCont.length; ++i) {
        var wordElem = wordsCont[i];
        var wordLowerCase = wordElem.text.toLowerCase();
        //We only need to translate the same word once, therefore,
        //translatedWords will be a global container to keep track of the number times the translated word appear.
        translatedWords[wordLowerCase] = wordElem.text in translatedWords ? translatedWords[wordLowerCase] + 1 : 1;

        // if (translatedWords[wordLowerCase] >= 2) {
        //     continue;
        // }

        var learnType = ( wordElem.learn_type == "view" ) ? 0 : 1;

        // Check if quiz mode have enough options
        if ( learnType == 1 ) {
            if ( ( 'choices' in wordElem.quiz ) && ( Object.keys(wordElem.quiz.choices).length == 3) ){
                learnType = 1;
            }
            else {
                learnType = 0;
            }
        }
        var popupID = wordElem.text + '_' + wordElem.word_id + '_' + wordElem.paragraph_index + '_' + learnType;

        var pronunciation = wordElem.pronunciation.replace('5', '');

        var popupData = {
            html: "",
            clickCounter: 0,
            word: wordElem.text,
            type: 0,
            pairID: wordElem.pair_id,
            paragraphIndex: wordElem.paragraph_index,
            wordIndex: wordElem.word_index,
            machine_translate: wordElem.translation,
            translatedWordIndex: 0,
            translatedWords: [],
            quiz: []
        };

        //Create a map to store all the translated words
        var translatedWordsCont = [];
        //Push machine translation into translated word container
        translatedWordsCont.push({
            id: wordElem.machine_translation_id,
            translation: wordElem.translation,
            pronunciation: pronunciation,
            audio_urls: wordElem.audio_urls,
            source: 0, //machine
            vote: wordElem.vote,
            more_url: wordElem.more_url
        });

        //If it is view mode
        if (learnType == 0) {

            //In learn mode, there will be annotation property in wordElem.
            //Therefore, we need to insert all the different translation available into a container and sort the ranking
            if ( 'annotations' in wordElem ) {
                for (var annotationIndex = 0; annotationIndex < wordElem.annotations.length; ++annotationIndex) {
                    translatedWordsCont.push({
                        id: wordElem.annotations[annotationIndex].id,
                        translation: wordElem.annotations[annotationIndex].translation,
                        pronunciation: wordElem.annotations[annotationIndex].pronunciation,
                        audio_urls: wordElem.annotations[annotationIndex].audio_urls,
                        source: 1, //user/human
                        vote: wordElem.annotations[annotationIndex].vote
                    })
                }

                //Sort the translated words in decreasing order according to vote

                translatedWordsCont.sort(function (lhs, rhs) {
                    if (lhs.vote < rhs.vote) {
                        return -1;
                    }
                    if (lhs.vote > rhs.vote) {
                        return 1;
                    }
                    return 0;
                });
            }
        } else {

            popupData.type = 1;
            popupData.quiz = wordElem.quiz;
        }

        popupData.translatedWords = translatedWordsCont;
        popupDataCont[popupID] = popupData;

        parag_word_idx_arr.push( { id : popupID, para_idx: wordElem.paragraph_index, word_idx: wordElem.position[2], selected_text: wordElem.text } )
        populateParagraphWordIndexArray( popupID, wordElem.paragraph_index, wordElem.position[2], wordElem.text );

        replaceWords(popupID);

    }
}

function removeListenersForQuizInput(id){
    for (var i = 0; i < NUM_OF_QUIZ_CHOICES; ++i) {
        var elem = document.getElementById('quiz_' + id + '_' + i);
        elem.removeEventListener("click", onQuizChoicesClick);
        elem.removeEventListener("mouseover", onQuizChoicesOver);
        $(elem).css("cursor", "default");
    }
}

function validateQuizInput(popupID, input) {
    var popupData = popupDataCont[popupID];
    var answer = popupData.machine_translate;
    //Add the quiz answer into event log
    addDetail(popupID, "answer", answer);
    //Send ajax post /log
    sendLog(getEventLog(popupID));

    //Can be changed to number
    var isCorrect = (answer == input) ? "correct" : "wrong";
    sendTakeQuiz( userSettings.userId, popupData.pairID, isCorrect, userSettings.learnLanguage, onSuccessUpdateScore, onVoteFailureUpdateScore );

    //TODO: This way of changing the backgroud image is wrong
    if (isCorrect == "correct") {
        $('.jfk-bubble').css("background-image", "url('https://lh4.googleusercontent.com/-RrJfb16vV84/VSvvkrrgAjI/AAAAAAAACCw/K3FWeamIb8U/w725-h525-no/fyp-correct.jpg')");
        $('.jfk-bubble').css("background-size", "cover");
        $('.content').css("background-color", "#cafffb");
        popupData.type = 0;
        // Resetting the tooltip
        var tooltip_word = null;
        if (settings.wordDisplay == WORD_DISPLAY_SHOW_ORIGINAL) {
            if ( popupData.type == 0) {
                tooltip_word = popupData.machine_translate;
            }
        } else {
            tooltip_word = popupData.word;
        }
        $("#"+popupID).attr('data-original-title', tooltip_word);
        $(document).off('click.wordnews', "#"+popupID ).on('click.wordnews', "#"+popupID, appendPopUp );
        removeListenersForQuizInput(popupID);

    } else {
        $('.jfk-bubble').css("background-image", "url('https://lh6.googleusercontent.com/--PJRQ0mlPes/VSv52jGjlUI/AAAAAAAACDU/dU3ehfK8Dq8/w725-h525-no/fyp-wrong.jpg')");
        $('.jfk-bubble').css("background-size", "cover");
    }
}

function onQuizChoicesClick() {
    var quizOptionID = $(this).attr('id');
    var splitQuiz = quizOptionID.split("_");
    // Generate id from quizOptionID
    var id = splitQuiz.slice(1,splitQuiz.length - 1);
    id = id.join("_");
    var index = splitQuiz[splitQuiz.length - 1];
    var input = this.innerHTML;
    //Create
    newEvent(id, "Click on " + index + ": " + input);
    console.log(input);
    validateQuizInput(id, input);
}

function onQuizChoicesOver() {

    var quizOptionID = $(this).attr('id');
    var input = this.innerHTML;
    var splitQuiz = quizOptionID.split("_");
    // Generate id from quizOptionID
    var id = splitQuiz.slice(1,splitQuiz.length-1);
    id = id.join("_");
    var index = splitQuiz[splitQuiz.length - 1];
    //Create
    newEvent(id, "Hover over on " + index + ": " + input);
    $(this).css("color", "#FF9900");
}

function onQuizChoicesMouseOut() {
    $(this).css("color", "#626262");
}

function appendQuizPopup(event) {
    var id = $(this).attr('id');
    $('.gtx-bubble').remove();
    var element = document.getElementById(id);
    var rect = cumulativeOffset(element);

    var displayID = id + "_popup";
    var myElem = document.getElementById(displayID);
    if (myElem != null) {
        document.body.removeChild(myElem);
    }
    var popupData = popupDataCont[id];

    var userAccess = checkRankAndLogin(rankAccess.TAKE_QUIZ);
    // For quiz, the text should be machine_translated.
    popupData.html = generateHTMLForQuiz(popupData.machine_translate, popupData.translation, id, popupData.quiz);
    $('body').append(popupData.html);
    if (userAccess == USER_HAS_ACCESS) {

        //Create an event log for take quiz
        createEventLog(id, userSettings.userId, "take_quiz", "start_quiz");

        //Create a variable to hold all the information for the choices
        var choicesInfo = [];

        for (var i = 0; i < NUM_OF_QUIZ_CHOICES; ++i) {
            var elem = document.getElementById('quiz_' + id + '_' + i);

            choicesInfo.push(i + "_" + elem.innerHTML);

            // Add an event listener for on click
            elem.addEventListener("click", onQuizChoicesClick);
            elem.addEventListener("mouseover", onQuizChoicesOver);
            elem.addEventListener("mouseout", onQuizChoicesMouseOut);
        }
        //Add additional information for the event log
        addDetail(id, "choices", choicesInfo);
    }

    //Re-acquire the popup
    myElem = document.getElementById(displayID);
    myElem.style.left = (rect.left - 100) + 'px';

    $('#' + displayID).fadeIn(300, function() {
        popup = id;
    });

    $('#' + id + '_close').bind('click', function(e) {
        // Prevents the default action to be triggered.
        e.preventDefault();
        $('#' + displayID).fadeOut(300);
        newEvent(id, "close");

        sendLog(getEventLog(id));
        popup = null;
    });

    // Fix left overflow out of screen
    if (rect.left - 100 < 0) {
        myElem.style.left = '0';
    }

    var screenWidth = $(window).width();
    var leftPlusWidth = rect.left + myElem.offsetWidth;
    console.log('ScreenWidth');
    console.log(screenWidth);
    console.log('left + width');
    console.log(leftPlusWidth);

    if (leftPlusWidth > screenWidth) {
        myElem.style.left = screenWidth - myElem.offsetWidth + 'px';
        console.log('new left:' + myElem.style.left);
        console.log(myElem.style.left);
    }

    myElem.style.top = (rect.top + 30) + 'px';

}

function setupPopUpCharSelect( id, popupData )
{
    //Get select translated character elem
    var translatedCharSelectElem = document.getElementById('translatedSelect_' + id);

    var userAccess = checkRankAndLogin(rankAccess.VIEW_HUMAN_ANNOTATION);

    //Determine the length of translation words to display
    var lenOfTranslatedWords = userAccess != USER_HAS_ACCESS ? 1 : popupData.translatedWords.length;

    //Create the list of translated words according to votes
    for (var i = 0; i < lenOfTranslatedWords; ++i) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = popupData.translatedWords[i].translation;
        translatedCharSelectElem.appendChild(opt);
    }

    //Get Audio elem
    var audioElem = document.getElementById('pronunciation_audio_' + id);
    var audio_urls = popupData.translatedWords[popupData.translatedWordIndex].audio_urls;
    appendAudioUrls(audioElem, audio_urls);

    //Add event listener for playing the audio
    var audioButtonElement = document.getElementById('btn_audio_' + id);
    audioButtonElement.addEventListener('click', function() {
        playAudio(audioElem);
        //Log down the event
        newEvent(id, "Click on audio");
    });


    //Add event listener for select onchange to update the other html elem
    translatedCharSelectElem.addEventListener("change", function() {
        popupData.translatedWordIndex = translatedCharSelectElem.selectedIndex;
        //set audio urls
        appendAudioUrls(audioElem, popupData.translatedWords[popupData.translatedWordIndex].audio_urls);
        //audioElem.src = popupData.translatedWords[popupData.translatedWordIndex].audio_urls[0];
        var pronunciationElem = document.getElementById('pronunciation_' + id);
        pronunciationElem.innerHTML = popupData.translatedWords[popupData.translatedWordIndex].pronunciation;
        playAudio(audioElem);

        // WHY DO WE SEND A VOTE HERE????
        sendVoteTranslation(userSettings.userId, popupData.translatedWords[popupData.translatedWordIndex].id, 1,
            popupData.translatedWords[popupData.translatedWordIndex].source, 0, onSuccessUpdateScore, onVoteFailureUpdateScore );
    });
}

function setupPopUpVoting( id, popupData )
{
    var textAreaDiv = document.getElementById('textarea_' + id);
    textAreaDiv.style.display ='none';

    var userAccess = checkRankAndLogin(rankAccess.VOTE_TRANSLATIONS);
    if (userAccess == USER_HAS_ACCESS) {
        $('#vote_translation_' + id).append( generateVotingHTML(id, popupData.word, popupData.translatedWords[0]));
        var voteYesBtnElem = document.getElementById('vote_yes_button_' + id);
        var voteNoBtnElem = document.getElementById('vote_no_button_' + id);


        //Add onclick event for yes button
        voteYesBtnElem.addEventListener("click", function() {
            sendVoteTranslation(userSettings.userId, popupData.translatedWords[popupData.translatedWordIndex].id, 1,
                popupData.translatedWords[popupData.translatedWordIndex].source, 1, onSuccessUpdateScore, onVoteFailureUpdateScore);

            newEvent(id, "Click on yes");
        });
        //Add onclick event for no button
        voteNoBtnElem.addEventListener("click", function() {
            sendVoteTranslation(userSettings.userId, popupData.translatedWords[popupData.translatedWordIndex].id, -1,
                popupData.translatedWords[popupData.translatedWordIndex].source, 1, onSuccessUpdateScore, onVoteFailureUpdateScore);

            newEvent(id, "Click on no");
            //Hide the vote translation div
            var voteTranslationDiv = document.getElementById('vote_translation_' + id);
            voteTranslationDiv.style.display ='none';
            //Unhide textbox to allow user to input their annotation
            textAreaDiv.style.display ='block';

        });



        var translatedTextInput = document.getElementById('translated_text_input_' + id);
        //Check for any input in the textbox
        translatedTextInput.addEventListener('keyup', function() {
            //If the length of text is more than 0, enable submit button
            var voteSubmitButton = document.getElementById('vote_submit_button_' + id);;
            voteSubmitButton.disabled = !(this.value.length > 0);

        });

        var voteSubmitButton = document.getElementById('vote_submit_button_' + id);
        //Disable the button as default
        voteSubmitButton.disabled = true;
        //When user keys his own translation, send an create_annotation API with respective data
        //
        voteSubmitButton.addEventListener("click", function () {
            if ( translatedTextInput.value.length > 0 ) {
                var title_date = getArticleTitleAndPublicationDate()
                sendCreateAnnotation(userSettings.userId, generateId(), popupData.word, translatedTextInput.value,
                    userSettings.learnLanguage, window.location.href, getURLPostfix(window.location.href), website,
                    popupData.paragraphIndex, popupData.wordIndex, title_date[0], title_date[1],
                    function (result) {
                        notifySuccess("New annotations created");
                        translatedTextInput.value = "";
                    },
                    function (error) {
                        onSendFailure(error);
                        translatedTextInput.value = "";
                    }
                );
            }

        });
    }
}
function appendPopUp(event) {
    var id = $(this).attr('id');
    $('.gtx-bubble').remove();
    var element = document.getElementById(id);
    var rect = cumulativeOffset(element);

    var displayID = id + "_popup";
    var myElem = document.getElementById(displayID);
    if (myElem != null) {
        document.body.removeChild(myElem);
    }
    var popupData = popupDataCont[id];

    sendView(userSettings.userId, popupData.pairID, userSettings.learnLanguage, onSuccessUpdateScore );

    ++popupData.clickCounter;

    createEventLog(id, userSettings.userId, "view", "start_view");
    popupData.html = generateHTMLForViewPopup(id, popupData.word, popupData.translatedWords[0]);
    $('body').append(popupData.html);

    setupPopUpCharSelect( id, popupData );

    setupPopUpVoting( id, popupData );

    myElem = document.getElementById(displayID);
    myElem.style.left = (rect.left - 100) + 'px';


    $('#' + id + '_close').bind('click', function(e) {
        // Prevents the default action to be triggered.
        e.preventDefault();
        $('#' + displayID).fadeOut(300, function(e){
            $('#' + displayID).remove();
        });
        newEvent(id, "close");

        sendLog(getEventLog(id));
        popup = null;
    });

    // Fix left overflow out of screen
    if (rect.left - 100 < 0) {
        myElem.style.left = '0';
    }

    var screenWidth = $(window).width();
    var leftPlusWidth = rect.left + myElem.offsetWidth;
    console.log('ScreenWidth');
    console.log(screenWidth);
    console.log('left + width');
    console.log(leftPlusWidth);

    if (leftPlusWidth > screenWidth) {
        myElem.style.left = screenWidth - myElem.offsetWidth + 'px';
        console.log('new left:' + myElem.style.left);
        console.log(myElem.style.left);
    }

    myElem.style.top = (rect.top + 30) + 'px';

    $('#' + displayID).fadeIn(300, function() {
        //$('#' + displayID).focus();
        popup = id;
    });

}

function appendAudioUrls(audioElement, urls) {
    // remove existing source elements
    //$(audioElement).remove("source");
    var source_elem_array = audioElement.querySelectorAll("source");
    for( var index=0; index < source_elem_array.length; index++ ) {
        audioElement.removeChild(source_elem_array[index]);
    }

    // create and append new source elements
    for (var i = 0; i < urls.length; i++) {
        var source = document.createElement("source");
        source.setAttribute("src", urls[i]);
        audioElement.appendChild(source);
    }
}

function preproccessParagraph(paragraph) {
    //paragraph = paragraph.replace("\n", " ");
    return paragraph.replace(/[^\x00-\x7F]/g, " ");
}

function cleanAllTranslation() {
    popupDataCont = {};
    translatedWords = {};
    parag_word_idx_array = [];
}

function beginTranslating() {

    cleanAllTranslation();

    var url_postfix = getURLPostfix(window.location.href);
    var url = window.location.href;
    var title_date = getArticleTitleAndPublicationDate();

    for (var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];
        var text = preproccessParagraph(paragraph.innerText);
        if (text.split(' ').length >= MIN_NUM_OF_WORDS_FOR_TRANSLATION) {
            sendRequestTranslatedWords( userSettings.userId, { paragraph_index: i, text: text }, settings.wordsLearn,
                settings.learn_lang, settings.translationType, url_postfix,
                url, title_date[0], title_date[1], settings.quizType,
                function ( result ) {
                    if ( "words_to_learn" in result ) {
                        var parag_word_idx_arr = [];
                        processTranslationResult(result.words_to_learn, parag_word_idx_arr);
                        //sortParagraphWordIndexArray( parag_word_idx_arr );
                        //replaceWordWithHTML( parag_word_idx_arr, generateHTMLForTranslationReplacement, appendTranslationReplacementTextListener );
                    }
                }
            );
        }
    }
};

function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
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
