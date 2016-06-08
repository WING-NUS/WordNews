package com.example.naijia.wordnews.Utils;

/**
 * Created by 益多 on 4/19/2016.
 */
public class NetworkUtils {
    public static final String BASE_URL = "http://wordnews-mobile.herokuapp.com/remember";

    public static String pronunciationUrl(String singlePinyin) {
        return String.format("http://wordnews-mobile.herokuapp.com/pinyin/%s.mp3", singlePinyin);
    }

}
