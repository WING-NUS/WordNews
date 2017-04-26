'use strict';

var annotationState = {
    NEW: 1,
    EXISTED: 2
};

function isValidString(str) {
    return !/[~`!#$%\^&*+=\\[\]\\';,./{}|\\":<>\?\s]/g.test(str);
}

// This function will get the whole word from selection. 
// If the selection is incomplete, e.g "ar" from "harm" is selected, 
// it will get the word "harm"
function getTextNodeFromSelection() {
    //Get the selection
    var textNode = getSelection();
    var range = textNode.getRangeAt(0);
    var node = textNode.anchorNode;        
    var offset = true; // Bool check for offsetting
    
    //If the number of words is more than SELECTION_MAX_NO_OF_WORDS
    var noOfWords = range.toString().split(" ").length;
    
    if (noOfWords >= SELECTION_MAX_NO_OF_WORDS)
    {
        console.log("More than 5 words")
        return [true, range];
    }
    
    if (range.startOffset > range.endOffset)
    {
        return [true, range];
    }

    //Loop backwards until we find the special character to break
    while (isValidString(range.toString()[0]))
    {
        //If the start offset is 0, break the loop since offset cannot be < 0
        if( range.startOffset == 0) {
            offset = false;
            break;
        }
        range.setStart(node, (range.startOffset - 1));
        //console.log(range.toString());
    }
    
    //Align to first character after the special character
    if (offset)
    {
        range.setStart(node, range.startOffset + 1);
    }

    offset = true; //Reset bool to true
    var lastIndex = range.toString().length - 1;
    //Loop forward until we find the special character to break
    do {        
        if (range.endOffset + 1 > node.length)
        {
            offset = false;
            break;
        }
        range.setEnd(node, range.endOffset + 1);     
        lastIndex++;
        //console.log(range.toString());
    } while (isValidString(range.toString()[lastIndex]));
    
    //Align to last character before the special character
    if (offset)
    {
        range.setEnd(node, range.endOffset - 1);
    }    
    //console.log(range.toString());
    
    return [false, range];
}

//Function to check whehter class exist with a given name
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function getParentElem(node) {
    var parentElem = null;
    
    //Get the parent node element
    parentElem = node.commonAncestorContainer;
    if (parentElem.nodeType != 1) {
        parentElem = parentElem.parentNode;
    }
    
    return parentElem;
}

//This function will take in the text node and check whether is there any annoation existed under this node
function checkAnnotationExisted(node) {
    var parentElem = getParentElem(node);    
    
    if (hasClass(parentElem, "annotate-highlight")) {
        console.log("annotate class existed")        
        return true;
    }    
    return false;
}

function generateId() {
    //This method creates semi-unique ID
    var i = new Date().getTime();
    i = i & 0xfffffff;
    //console.log(i);
    return (i + Math.floor(Math.random() * i));
}


function paintCursor() {
    var cursor = chrome.extension.getURL('images/highlighter-orange.cur');
    console.log(cursor);
    document.body.style.cursor = "url(" + cursor + "),auto";
}


/*
 * 1. Highlight the selected text 
 * 2. Insert JS for annotation panel 
 * 3. Verify the length of text (min and max)
 * 4. Automatically extend to the nearest textual words if the selection contains partial word 
 	  http://stackoverflow.com/questions/7563169/detect-which-word-has-been-clicked-on-within-a-text
 * 5. Can not highlight a string with existing highlighted words  
 */

function highlight() {
    var result =  getTextNodeFromSelection();
    var textNode = result[1];
    var error = result[0]
    error = error || checkAnnotationExisted(textNode);

    if (!error && textNode.toString().length > 1)
    {
        //Generate an unique ID for the annotation
        var annotationPanelID = generateId();
        var sNode = document.createElement("span");
        sNode.id = annotationPanelID;
        sNode.className = "annotate-highlight";
        try
        {
            textNode.surroundContents(sNode);
        }
        catch(err)
        {
            console.log(err);
            return -1
        }

        var parent = getParentElem(textNode);
        var pidx = 0;
        var widx = 0;
        if (parent != null) {
            pidx = getParagraphIndex(parent);
            console.log(pidx);
            widx = getWordIndex(parent, textNode);
            sNode.setAttribute('value', pidx + ',' + widx);
        }

        var annotationData = {
            panelID: annotationPanelID,
            id : -1,
            para_idx: pidx,
            word_idx: widx,
            selected_text: textNode.toString(),
            translation: "",
            state: annotationState.NEW
        };

        annotationDataCont[annotationPanelID] = annotationData;


        $("#" + annotationPanelID ).off('click.annotation').on('click.annotation', appendAnnotationPanel);
        $("#" + annotationPanelID ).click();

        return annotationPanelID;
    }
    else {
        //TODO: Show a proper UI such as notification for error
        return -1;
    }
}

function getParagraphIndex(p) {
    var i = 0;
    for (; i < paragraphs.length; i++) {
        if (p.isSameNode(paragraphs[i])) {
            return i;
        }
    }
    return -1;
}

function getWordIndex(p, textNode) {    
    var precedingRange = document.createRange();
    precedingRange.setStartBefore(p.firstChild);
    precedingRange.setEnd(textNode.startContainer, textNode.startOffset);
    //Cache the strings 
    var precedingText = precedingRange.toString();
    return precedingText.length;

    // var selectedText = textNode.toString();
    // var count = 0;
    // var idx = precedingText.indexOf(selectedText); //Get the index of the selected text
    // while (idx < precedingText.length && idx != -1) {
    //     ++count;
    //     //Get the next index of the selected text
    //     idx = precedingText.indexOf(selectedText, idx + 1);
    // }
    // return count;
}

//This function will remove current element which contains annotation and 
//combine the data with previous and next
function removeAnnotationElement(elem) {
    var addNext = false;
    var nextElem = elem.nextSibling;
    
    if (!hasClass(nextElem, "annotate-highlight"))
    {       
        nextElem.data = elem.innerHTML + nextElem.data;
        addNext = true;
    }
    
    var prevElem = elem.previousSibling;
    //if the previous sibings is not an annotation class
    if (!hasClass(nextElem, "annotate-highlight"))
    {
        if (addNext) //if there is a need to add in next
        {
            prevElem.data +=  nextElem.data
            nextElem.remove();
        }
        else //just add in the current element text
        {
            prevElem.data +=  elem.innerHTML
        }
    }
    elem.remove()
}

function updatePanelPosition (annotationPanelID) {
    var element = document.getElementById(annotationPanelID);

    var rect = cumulativeOffset(element);
    console.log("rect: " + rect.left + " " + rect.top);
    var panelID  = annotationPanelID + "_popup";
    var panel = document.getElementById(panelID);
    panel.style.position = "absolute";
    panel.style.left = (rect.left - 20) + 'px';
    panel.style.top = (rect.top + 20) + 'px';
    panel.className = "annotate-panel";
}

function generateHTMLForAnnotationPopup (annotationID, state, anno_id, country, lang, translation ) {

    translation = typeof translation !== 'undefined' ? translation : null;

    var panelID  = annotationID + "_popup";
    var editorID = annotationID + "_editor";

    var panelHtml = '<div id=\"' + panelID + '\" class=\"panel\" data-state=\"' + state  + ' \"data-id=\"' + anno_id + '\">';

    panelHtml += '<span class=\"bfh-languages\" data-language=\"' +
        settings.ann_lang + '\" data-flags=\"true\">' +
        '<i class="glyphicon bfh-flag-'+country+ '" title="' + lang + '"></i></span><br>';
    panelHtml += '<textarea id=\"' + editorID + '\" style="background:yellow">' + (translation==null ? "" : translation) + '</textarea><br>';
    panelHtml += '<div class=\"btn-group\" style=\"margin:5px;\">'
    panelHtml += '<button id=\"annontation-delete-btn' + annotationID + '\" type=\"delete\" class=\"btn btn-info btn-xs\">Delete</button> &nbsp;';
    panelHtml += '<button id=\"annontation-cancel-btn' + annotationID + '\" type=\"cancel\" class=\"btn btn-info btn-xs\">Cancel</button> &nbsp;';
    panelHtml += '<button id=\"annontation-submit-btn' + annotationID + '\" type=\"submit\" class=\"btn btn-info btn-xs\">Submit</button>';
    panelHtml += '</div></div>';

    return panelHtml;
}

function generateHTMLForAnnotationHighlight( annotationPanelID, paragraph_idx, idx, selected_text )
{
    var html = '<span id=\"' + annotationPanelID + '\" class=\"annotate-highlight\" value=\"' + paragraph_idx + ',' + idx + '\">' + selected_text + '</span>';
    return html;
}

function generateHTMLForAnnoHighlight( annotationPanelID )
{
    if( typeof annotationDataCont[annotationPanelID] === 'undefined') {
        return ' ';
    }

    var annoData = annotationDataCont[annotationPanelID];

    var html = '<span id=\"' + annotationPanelID + '\" class=\"annotate-highlight\" value=\"' + annoData.para_idx + ',' + annoData.word_idx + '\">' + annoData.selected_text + '</span>';
    return html;
}

function appendAnnotationReplacementTextListener( annotationPanelID ) {

    $(document).off('click.annotation', "#"+annotationPanelID ).on('click.annotation', "#"+annotationPanelID, appendAnnotationPanel);

}
function onAnnotationPanelClose(id) {
    var highlightWords = $("#" + id);
    var elem = document.getElementById(id);
    removeAnnotationElement(elem)
    highlightWords.contents().unwrap();
    delete annotationDataCont[id];
}

function appendAnnotationPanel(event) {
    var id = $(this).attr('id');

    var panelID  = id + "_popup";
    var myElem = document.getElementById(panelID);
    if (myElem != null) {
        document.body.removeChild(myElem);
    }
    if ( !( id in annotationDataCont )) {
        return
    }

    var annoData = annotationDataCont[id];

    var highlightWords = $("#" + id);
    var panelID  = id + "_popup";
    var editorID = id + "_editor";
    var annotationLanguageSplit = settings.ann_lang.split('_');
    var lang = BFHLanguagesList[annotationLanguageSplit[0]]; // in native language
    var country = annotationLanguageSplit[1];

    var panelHtml = generateHTMLForAnnotationPopup( id, annoData.state, annoData.id, country, lang, annoData.translation );

    $("body").append(panelHtml);
    updatePanelPosition(id);

    if ( popup != null ) {
        var myElem = $("#" + popup + "_popup");
        var annoDataTest = annotationDataCont[popup];
        if ( annoDataTest.state == annotationState.NEW ) {
            onAnnotationPanelClose(popup);
        }
        myElem.remove();
        popup = null
    }

    var panel = document.getElementById(panelID);
    panel = $(panel);

    $("#" + panelID + " button").click(function() {
        var mode = $(this).attr('type');
        if (mode == 'cancel') {
            //panel.hide();
            if ( annoData.state == annotationState.NEW ) {
                onAnnotationPanelClose(id);
            }
        } else if (mode == 'delete') {
            deleteAnnotationFromServer(id);
            onAnnotationPanelClose(id);
        } else {
            var textAreaElem = document.getElementById(editorID);
            if ( textAreaElem == null || textAreaElem.value <=0 ) {
                onAnnotationPanelClose(id);
            }
            else {
                console.log("save");
                saveAnnotation(id, annoData.selected_text, editorID, annoData.para_idx, annoData.word_idx);
            }
        }
        panel.fadeOut(300, function() {
            $(this).remove();
            popup = null
        });
    });

    $("#" + panelID).on( 'onRemove', function( event, dom ){
        var annoDataTest = annotationDataCont[id];
        if ( annoDataTest.state == annotationState.NEW ) {
            onAnnotationPanelClose(id);
        }
    });
    panel.fadeIn(300, function() {
        popup = id;

    });

}

function saveAnnotation(annotationPanelID, word, editorID, paragrahIndex, wordIndex ) {
    
    //Get the translated word
    var textAreaElem = document.getElementById(editorID);

    var state = $('#' + annotationPanelID + "_popup").data('state');
    //If the annotation is newly created, send data to server to add into database
    if(state == annotationState.NEW) {
        var title_date = getArticleTitleAndPublicationDate();
        sendCreateAnnotation( userSettings.userId, annotationPanelID, word, textAreaElem.value, settings.ann_lang, window.location.href,
            getURLPostfix(window.location.href), website, paragrahIndex, wordIndex, title_date[0], title_date[1],
            function(result) { // post successful and result returned by server
                console.log( "add annotation post success", result );

                //Change the state of the annotation from new to existed
                var panelID  = annotationPanelID + "_popup";
                $('#' + panelID).data('state', annotationState.EXISTED);
                $('#' + panelID).data('id', result.id); // add the annotation id from server
                annotationDataCont[annotationPanelID].state = annotationState.EXISTED;
                annotationDataCont[annotationPanelID].id = result.id;
                annotationDataCont[annotationPanelID].translation = textAreaElem.value;
                notifySuccess( "New annotation added!");
            },
            function( error ) {
                onSendFailure(error);
                onAnnotationPanelClose(annotationPanelID);
            }
        );

    }        
    else { // Else update the annnotation 
        var annotation_id = $('#' + annotationPanelID + "_popup").data('id');

        sendUpdateAnnotation(userSettings.userId, annotation_id, textAreaElem.value,
            function(result) {
                console.log( "update annotation get success" );
                var panelID  = annotationPanelID + "_popup";
                $('#' + panelID).data('id', result.id); // update annotation id from server
                annotationDataCont[annotationPanelID].id = result.id;
                annotationDataCont[annotationPanelID].translation = textAreaElem.value;
                notifySuccess( "Annotation updated!");
            },
            function( error ) {
                onSendFailure(error);
                onAnnotationPanelClose(annotationPanelID);
            }
        );
    }
}

//Send to server to remove annoation
function deleteAnnotationFromServer(annotationPanelID) {	
    //Need to check the state of the annotation
    var state = $('#' + annotationPanelID + "_popup").data('state');
    //If the annotation existed in database, send request to remove it
    if(state == annotationState.EXISTED)
    {
        var annotationID = $('#' + annotationPanelID + "_popup").data('id');
        sendDeleteAnnotation( userSettings.userId, annotationID, onSuccessUpdateScore );
    }
}

function showAnnotations() {
    sendShowAnnotation( userSettings.userId, getURLPostfix(window.location.href), settings.ann_lang,
        function(result) {
            if ( 'annotations' in result ) {
                parag_word_idx_array = [];
                for (var i = 0; i < result.annotations.length; ++i) {
                    processAnnotationData(result.annotations[i], parag_word_idx_array );
                }

                sortParagraphWordIndexArray( parag_word_idx_array );
                replaceWordWithHTML( parag_word_idx_array, generateHTMLForAnnoHighlight, appendAnnotationReplacementTextListener );
            }
        }
    );

    // sendShowAllAnnotationByURL( getURLPostfix(window.location.href), settings.ann_lang,
    //     function(result) {
    //         if ( 'annotations' in result ) {
    //             parag_word_idx_array = [];
    //             for (var i = 0; i < result.annotations.length; ++i) {
    //                 processAnnotationData(result.annotations[i], parag_word_idx_array );
    //             }
    //
    //             sortParagraphWordIndexArray( parag_word_idx_array );
    //             replaceWordWithHTML( parag_word_idx_array, generateHTMLForAnnoHighlight, appendAnnotationReplacementTextListener );
    //
    //         }
    //     }
    // );
}

function processAnnotationData( ann, parag_word_idx_arr )  {
    if (paragraphs.length < ann.paragraph_idx) {
        console.log("layout changed");
        return;
    }

    // for ( var i = 0; i < parag_word_idx_arr.length; i++ ) {
    //     if ( ann.paragraph_idx+"_"+ann.text_idx == parag_word_idx_arr[i].para_word_idx ) {
    //         //duplicate found
    //         return;
    //     }
    // }
    var annotationPanelID = generateId();
    var annotationData = {
        panelID: annotationPanelID,
        id : ann.id,
        para_idx: ann.paragraph_idx,
        word_idx: ann.text_idx,
        selected_text: ann.selected_text,
        translation: ann.translation,
        state: annotationState.EXISTED
    };

    annotationDataCont[annotationPanelID] = annotationData;

    parag_word_idx_arr.push( { id : annotationPanelID, para_idx: ann.paragraph_idx, word_idx: ann.text_idx, selected_text: ann.selected_text } )

}

// function showAnnotation(ann) {
//     if (paragraphs.length < ann.paragraph_idx) {
//         console.log("layout changed");
//         return;
//     }
//
//     var para = paragraphs[ann.paragraph_idx];
//     var innerHtml = para.innerHTML;
//     console.log(para);
//
//     var count = 0;
//     var idx = innerHtml.indexOf(ann.selected_text);
//     while (idx != -1) { //Iterate the whole <p> to find the selected word
//         if (count == ann.text_idx) { //If count is equals to the number word occurance
//
//             var annotationPanelID = generateId();
//
//             //Get the before and after text from selected text
//             var before = innerHtml.slice(0, idx);
//             var after = innerHtml.slice(idx + ann.selected_text.length);
//             //Create <span> HTML tag and add to the middle
//
//             var html = generateHTMLForAnnotationHighlight( annotationPanelID, ann.paragraph_idx, idx, ann.selected_text );
//
//             para.innerHTML = before + html + after;
//
//             var annotationData = {
//                 panelID: annotationPanelID,
//                 id : ann.id,
//                 para_idx: ann.paragraph_idx,
//                 word_idx: idx,
//                 selected_text: ann.selected_text,
//                 translation: ann.translation,
//                 state: annotationState.EXISTED
//             };
//
//             annotationDataCont[annotationPanelID] = annotationData;
//
//
//             $(".annotate-highlight").off('click.annotation').on('click.annotation', appendAnnotationPanel);
//
//             return;
//         }
//         ++count;
//         idx = innerHtml.indexOf(ann.selected_text, idx + 1); //Searching the word starting from idx
//     }
//     console.log("Cannot find the " + ann.selected_text + "  in paragraph " + ann.paragraph_idx);
// }

//TODO: If BBC changes their HTML format, we will need to update this accordingly
function showAnnotationCounterForBBCRelatedURL () {
    //Get the unorder list <ul>
    var list = document.getElementsByClassName("group story-alsos more-on-this-story"); 
    
    for (var i = 0; i < list.length; ++i) {
        var links = list[i].getElementsByTagName("a"); //Get all the links
        if (links.length > 0) {
            for (var i = 0; i < links.length; ++i)
            {
                appendAnnotationCounterForURL(links[i]);
            }
        }
    }
}

//TODO: If CNN changes their HTML format, we will need to update this accordingly
function showAnnotationCounterForCNNRelatedURL () {
    //Get the unorder list <ul>
    //<div class="ob-widget-section ob-last">
    var currentElem = document.getElementsByClassName("ob-widget-section ob-last");
    if (currentElem.length > 0)
    {
        currentElem = currentElem[0];        
        var list = currentElem.getElementsByClassName("ob-widget-items-container"); 
        
        for (var i = 0; i < list.length; ++i) {
            var links = list[i].getElementsByTagName("a"); //Get all the links
            if (links.length > 0) {
                for (var i = 0; i < links.length; ++i)
                {
                    appendAnnotationCounterForURL(links[i]);
                }
            }
        }
    }
}

function appendAnnotationCounterForURL (link) {    
    var linkElem = link;
    console.log(linkElem.href);
    sendShowAnnotationCount( getURLPostfix(linkElem.href), settings.ann_lang,
        function(result) {
            // get successful and result returned by server
            console.log(linkElem.href + " annotation counter: " + result.annotation_count);
            //If there is more than one annotation in the link, display the counter
            if ( ('annotation_count' in result) && (result.annotation_count > 0) ) {
                var countSpan = document.createElement('span');
                countSpan.innerHTML = " Annotation count: " + result.annotation_count;
                linkElem.appendChild(countSpan);
            }
        }
    );
}

function cleanAllAnnotation() {
    annotationDataCont = {};
}

function beginAnnotation() {
    cleanAllAnnotation();
	showAnnotations();
    getArticleTitleAndPublicationDate();
    showAnnotationCounterForBBCRelatedURL();
    showAnnotationCounterForCNNRelatedURL();
    $('body').on("mouseup", paragraphFormatTag, function(e) {
        var id = highlight();
        e.stopPropagation();
        if (id == -1)
        {
            console.log("Error: Unable to create annotation");
        }
        console.log($("#" + id));
    });

    paintCursor();

}
