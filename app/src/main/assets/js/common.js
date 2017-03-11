
//const hostUrl = 'http://wordnews.herokuapp.com';
//const hostUrl = "http://wordnews-mobile.herokuapp.com";
const hostUrl = "http://wordnews-annotate.herokuapp.com";
//const hostUrl = "https://wordnews-server-kite19881.c9users.io"
//const hostUrl = "http://localhost:3000";

// Define if user wants to see original text or translated text
const WORD_DISPLAY_SHOW_ORIGINAL        = 0;
const WORD_DISPLAY_SHOW_TRANSLATED      = 1;

// Bit position which defines the news website.
const WEBSITE_SETTING_BIT_CNN               = 0;
const WEBSITE_SETTING_BIT_CHINA_DAILY       = 1;
const WEBSITE_SETTING_BIT_BBC               = 2;
var WEBSITE_SETTING_ARRAY = {
    0 : 'cnn.com',
    1 : 'chinadaily.com.cn',
    2 : 'bbc.co'
};

// Mode of operation
const MODE_LOOKUP_DISABLE                   = 0;
const MODE_LOOKUP_LEARN                     = 1;
const MODE_LOOKUP_ANNOTATE                  = 2;
var MODE_LOOKUP_ARRAY = {
    0 : 'disable',
    1 : 'learn',
    2 : 'annotate'
};

// Define the top 'N' most annotated article
const NUM_OF_MOST_ANNOTATED_ARTICLES        = 10;

// Define the number of words to translate per paragraph
const INITIAL_WORDS_TO_LEARN                = 1;

// List of Message Type
const MESSAGE_REQUEST_TYPE_NEW_TAB                              = "new_tab";
const MESSAGE_REQUEST_TYPE_TAB_ACTIVE                           = "active";
const MESSAGE_REQUEST_TYPE_UPDATE_TAB_SETTINS                   = "update_tab";
const MESSAGE_REQUEST_TYPE_NEW_PAGE                             = "new_page";
const MESSAGE_REQUEST_TYPE_UPDATE_SCORE_RANK                    = "update_score_rank";
const MESSAGE_REQUEST_TYPE_GET_USER_SETTINGS                    = "get_user_settings";
const MESSAGE_REQUEST_TYPE_SEND_FB_RECOMMEND                    = "send_fb_recommend";
const MESSAGE_REQUEST_TYPE_UPDATE_WEBSITE                       = "update_website_setting";
const MESSAGE_REQUEST_TYPE_POPUP_SYNC_USER                      = "popup_sync_user";
const MESSAGE_REQUEST_TYPE_UPDATE_SOURCE_TRANSLATED             = "update_source_translated";

const NUM_OF_QUIZ_CHOICES                   = 4;

const MIN_NUM_OF_WORDS_FOR_TRANSLATION      = 10;

const SELECTION_MAX_NO_OF_WORDS             = 5;

// RANK_ACCESS
const USER_RANK_INSUFFICIENT                = -1;
const USER_NOT_LOGGED_IN                    = -2;
const USER_HAS_ACCESS                       = 0;

function bTest(num, bit){
    return ((num>>bit) % 2 != 0)
}

function bSet(num, bit){
    return num | (1<<bit);
}

function bUnset(num, bit){
    return num & ~(1<<bit);
}

function bToggle(num, bit){
    return bTest(num, bit) ? bUnset(num, bit) : bSet(num, bit);
}

function httpPostServer( url, data, onSuccessCallback, onErrorCallback ) {
    onSuccessCallback = typeof onSuccessCallback !== 'undefined' ? onSuccessCallback : null;
    onErrorCallback = typeof onErrorCallback !== 'undefined' ? onErrorCallback : null;
    $.ajax({
        type: "post",
        beforeSend : function (request) {
            request.setRequestHeader("Accept", "application/json");
        },
        url: url,
        dataType: "json",
        data: data,
        success: function (result) {
            if ( onSuccessCallback != null ) {
                onSuccessCallback(result)
            }
        },
        error: function (error) {
            if ( onErrorCallback != null ) {
                onErrorCallback(error)
            }
        }
    })
}

function httpGetServer( url, data, onSuccessCallback, onErrorCallback ) {
    onSuccessCallback = typeof onSuccessCallback !== 'undefined' ? onSuccessCallback : null;
    onErrorCallback = typeof onErrorCallback !== 'undefined' ? onErrorCallback : null;
    $.ajax({
        type: "get",
        beforeSend : function (request) {
            request.setRequestHeader("Accept", "application/json");
        },
        url: url,
        dataType: "json",
        data: data,
        success: function (result) {
            if ( onSuccessCallback != null ) {
                onSuccessCallback(result)
            }
        },
        error: function (error) {
            if ( onErrorCallback != null ) {
                onErrorCallback(error)
            }
        }
    })
}
