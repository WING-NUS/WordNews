package com.example.naijia.wordnews.api;
import java.util.*;
/**
 * Created by wuweilun on 26/1/16.
 */
public class TranslatedResult {
    boolean isTest;
    String wordID;
    String chinese;
    int position;
    String pronunciation;
    HashMap<Integer, String> chineseSentence;
    HashMap<Integer, String> englishSentence;
    HashMap<Integer, String> choices;

    public TranslatedResult() {
    }
}
