
function sendLog (data, onSuccessCallback, onErrorCallback) {
    httpPostServer( hostUrl + '/log', data, onSuccessCallback, onErrorCallback );
}

function sendRequestTranslatedWords( userID, paragraphs, num_of_words, lang, translatorType, url_postfix, url, title, pub_date, quizType, onSuccessCallback, onErrorCallback ) {

    var data = {
        paragraphs: [paragraphs],
        num_of_words: num_of_words,
        lang: lang,
        translator: translatorType,
        user_id: userID,
        url_postfix: url_postfix,
        url: url,
        title: title,
        publication_date: pub_date,
        quiz_generator: quizType
    };

    httpPostServer( hostUrl + "/show_learn_words", data, onSuccessCallback, onErrorCallback );
}

function sendFBRecommend( userID, num, lang, url, onSuccessCallback, onErrorCallback ) {

    var data = {
        user_id: userID,
        num: num,
        lang: lang,
        url: url
    };

    httpPostServer( hostUrl + "/auth/facebook/post_recommend", data, onSuccessCallback, onErrorCallback );
}

function sendVoteTranslation( userID, translationPairID, score, source, isExplicit, onSuccessCallback, onErrorCallback ) {

    var data = {
        user_id: userID,
        translation_pair_id: translationPairID,
        score: score,
        source: source,
        is_explicit: isExplicit
    };

    httpPostServer( hostUrl + '/vote', data, onSuccessCallback, onErrorCallback );
}

function sendTakeQuiz( userID, translation_pair_id, answer, lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        translation_pair_id: translation_pair_id,
        answer: answer,
        lang: lang
    };

    httpPostServer( hostUrl + '/take_quiz', data, onSuccessCallback, onErrorCallback );
}

function sendView( userID, translation_pair_id, lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        translation_pair_id: translation_pair_id,
        lang: lang
    };

    httpPostServer( hostUrl + '/view', data, onSuccessCallback, onErrorCallback );
}

function sendCreateAnnotation( userID, ann_id, selected_text, trans, lang, url, url_postfix, website, parag_idx, text_idx,
                               title, pub_date, onSuccessCallback, onErrorCallback ) {
    var data = {
        annotation: {
            ann_id: ann_id, //This is popup panel id
            user_id: userID,
            selected_text: selected_text,
            translation: trans,
            lang: lang,
            url: url,
            url_postfix: url_postfix,
            website: website,
            paragraph_idx: parag_idx,
            text_idx: text_idx,
            title: title,
            publication_date: pub_date
        }
    };

    httpPostServer( hostUrl + "/create_annotation", data, onSuccessCallback, onErrorCallback );
}

function sendUpdateAnnotation( userID, ann_id, translation, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        id: ann_id,
        translation: translation
    };

    httpPostServer( hostUrl + "/update_annotation", data, onSuccessCallback, onErrorCallback );
}

function sendDeleteAnnotation( userID, ann_id, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        id: ann_id
    };

    httpPostServer( hostUrl + "/delete_annotation", data, onSuccessCallback, onErrorCallback );
}

function sendShowAnnotation( userID, url_postfix, lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        url_postfix: url_postfix,
        lang: lang
    };

    httpPostServer( hostUrl + "/show_annotation_by_user_url", data, onSuccessCallback, onErrorCallback );
}

function sendShowAnnotationCount( url_postfix, lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        url_postfix: url_postfix,
        lang: lang
    };

    httpPostServer( hostUrl + "/show_annotation_count_by_url", data, onSuccessCallback, onErrorCallback );
}

function sendShowUserAnnotationHistroy( userID,  lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        user_id: userID,
        lang: lang
    };

    httpPostServer( hostUrl + '/show_user_annotation_history', data, onSuccessCallback, onErrorCallback );
}

function sendShowAllAnnotationByURL( url_postfix, lang, onSuccessCallback, onErrorCallback ) {
    var data = {
        url_postfix: url_postfix,
        lang: lang
    };

    httpPostServer( hostUrl + '/show_annotation_by_url', data, onSuccessCallback, onErrorCallback );
}
