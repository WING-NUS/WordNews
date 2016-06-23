package com.example.naijia.wordnews.Utils;

import com.example.naijia.wordnews.models.TemporaryUser;
import com.example.naijia.wordnews.models.User;

/**
 * Created by 益多 on 4/19/2016.
 */
public class NetworkUtils {
    public static final String BASE_URL = "http://wordnews-mobile.herokuapp.com/";
    public static final String REMEMBER_URL = BASE_URL + "remember";

    public static User user = new TemporaryUser();

    public static String pronunciationUrl(String singlePinyin) {
        return String.format("http://wordnews-mobile.herokuapp.com/pinyin/%s.mp3", singlePinyin);
    }

}
