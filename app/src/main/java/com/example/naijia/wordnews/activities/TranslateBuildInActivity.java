package com.example.naijia.wordnews.activities;

import android.graphics.Color;
import android.graphics.Typeface;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.naijia.wordnews.Utils.NetworkUtils;
import com.example.naijia.wordnews.api.APIRequest;
import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.Utils.ViewDialog;

import com.example.naijia.wordnews.api.PostRequest;
import com.example.naijia.wordnews.api.GetRequest;
import com.example.naijia.wordnews.models.PostData;
import com.example.naijia.wordnews.models.Word;

import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.net.ssl.HttpsURLConnection;

public class TranslateBuildInActivity extends AppCompatActivity {
    private String url;
    private String passedURL;
    private String title;
    private static final int UPDATE_UI = 1;
    private boolean notTranslated = true;
    Map<Integer, String> paragraphs;
    LinearLayout linearLayout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate_buildin);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        linearLayout = (LinearLayout)findViewById(R.id.dynamic_linear_layout);

        Bundle b = getIntent().getExtras();
        passedURL = b.getString("key");
        title = b.getString("title");

        TextView textView = new TextView(getApplicationContext());
        textView.setTextSize(20);
        textView.setTextColor(Color.parseColor("#ff000000"));
        textView.setText(title);
        textView.setGravity(Gravity.CENTER);
        textView.setTypeface(null, Typeface.BOLD);
        linearLayout.addView(textView);

        fetchParagraph();
    }

    private void fetchParagraph() {
        try{
            paragraphs = new LinkedHashMap<Integer, String>();
            int i = 0;
            String mainContent = "";
            mainContent = new APIRequest().execute(passedURL).get();
            Log.d("WindowFocus URL", passedURL);
            Log.d("WindowFocus RESPONSE", mainContent);

            int index1 = mainContent.indexOf("<p>");
            int index2 = mainContent.indexOf("</p>");
            while (index1 >= 0 && index2 >= 0) {
                if(index1+3 < mainContent.length() && index2 < mainContent.length() && index2>index1+3) {
                    String paragraph = mainContent.substring(index1+3, index2);
                    Log.d("PARAGRAPH BEFORE", paragraph);
                    int pair1, pair2;
                    while(true) {
                        pair1 = paragraph.indexOf('<');
                        pair2 = paragraph.indexOf('>');
                        if(pair1 < pair2) {
                            Log.d("EXTRA STRING", paragraph.substring(pair1, pair2+1));
                            paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair2+1);
                        }
                        else{
                            break;
                        }
                    }
                    while(true) {
                        pair1 = paragraph.indexOf('[');
                        pair2 = paragraph.indexOf(']');
                        if(pair1 < pair2) {
                            Log.d("EXTRA STRING", paragraph.substring(pair1, pair2+1));
                            paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair2+1);
                        }
                        else{
                            break;
                        }
                    }
                    ArrayList<String> patterns = new ArrayList<String>();
                    patterns.add("&nbsp;");
                    patterns.add("&pound;");
                    for(int index=0;index<patterns.size();index++) {
                        String pattern = patterns.get(index);
                        while(true){
                            pair1 = paragraph.indexOf(pattern);
                            if(pair1>=0)
                                paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair1+pattern.length());
                            else
                                break;
                        }
                    }
                    paragraph = paragraph.replaceAll("&rsquo;","'");
                    paragraph = paragraph.replaceAll("&rdquo;","\"");
                    paragraph = paragraph.replaceAll("&ldquo;","\"");
                    paragraph = paragraph.replaceAll("&amp;","&");
                    paragraph = paragraph.replaceAll("&ndash;","–");
                    paragraph = paragraph.replaceAll("&mdash;","—");
//                    paragraph = paragraph.replaceAll("\\\"","\"");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    String[] splitParagraph = paragraph.split("\\\\r\\\\n");
                    for(int j=0;j<splitParagraph.length;j++) {
                        String newParagraph = "\n" + splitParagraph[j];
                        TextView textView = new TextView(getApplicationContext());
                        textView.setTextSize(16);
                        textView.setId(i);
                        textView.setTextColor(Color.parseColor("#ff000000"));
                        linearLayout.addView(textView);
                        textView.setText(newParagraph);
                        paragraphs.put(i++, newParagraph);
                    }
                }
                index1 = mainContent.indexOf("<p>", index1 + 1);
                index2 = mainContent.indexOf("</p>", index2 + 1);
            }
        }
        catch (ExecutionException | InterruptedException e) {
            Log.d("ERROR", e.toString());
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        if(hasFocus && notTranslated){
            notTranslated = false;
            Log.d("Windows Focused", "Windows Focused");
            if(paragraphs!=null)
                for(final Integer key : paragraphs.keySet()) {
                    final String paragraph = paragraphs.get(key);
                    Thread thread = new Thread(new Runnable(){
                        @Override
                        public void run(){
                        try {
                            Log.d("In a new Thread", "In a new Thread");
                            String urlParameters = "text="+paragraph+"&url="+passedURL+"&name="+"zhengnaijia_19920112"+"&num_words="+"3";
                            String translateUrl = "http://wordnews-mobile.herokuapp.com/show/";
                            String translate_words = new PostRequest().execute(translateUrl,urlParameters).get();

                            if(translate_words!=null && !translate_words.equals("FAILED")){
                                // parse the returned JSON
                                JSONObject translateJSONObject = new JSONObject(translate_words);
                                ArrayList<Word> words = new ArrayList<Word>();
                                Iterator<String> keys = translateJSONObject.keys();
                                //Intial word
                                words.add(Word.builder().paragraph(paragraph).paragraphID(key).build());
                                while(keys.hasNext()) {
                                    String english = (String) keys.next();
                                    JSONObject wordJson = new JSONObject(translateJSONObject.getString(english));
                                    Log.d("TRANSLATE WORDS", wordJson.toString());
                                    Word word = Word.builder().english(english).chinese(wordJson.getString("chinese"))
                                            .wordID(wordJson.getString("wordID"))
                                            .pronunciation(wordJson.getString("pronunciation").replace("\\n",""))
                                            .position(wordJson.getInt("position"))
                                            .passedUrl(passedURL)
                                            .isTest( wordJson.getInt("isTest")==0?Boolean.FALSE:Boolean.TRUE).build();
                                    words.add(word);
                                    // TODO: Use this result for check isTest and pronunciation etc
                                }
                                handler_.sendMessage(Message.obtain(handler_, UPDATE_UI, words));
                            }

                        } catch (ExecutionException | JSONException | InterruptedException e) {
                            Log.d("ERROR", e.toString());
                        }
                        }
                    });
                    thread.start();
                }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    private Handler handler_ = new Handler(){
        @Override
        public void handleMessage(Message msg){
        switch(msg.what){
            case UPDATE_UI:
                ArrayList<Word> words = (ArrayList<Word>)msg.obj;
                //do what you need to with the InputStream
                if(words.size()>0)
                {
                    String paragraph = words.get(0).paragraph;
                    Integer paragraphID = words.get(0).paragraphID;
                    SpannableString ss = new SpannableString(paragraph);
                    TextView textView = (TextView)findViewById(paragraphID);

                    for (int i=1;i<words.size();i++) {
                        final Word word = words.get(i);
                        ClickableSpan clickableSpan = new ClickableSpan() {
                            @Override
                            public void onClick(View view) {
                                ViewDialog alert = new ViewDialog();
                                TextView tmpView = (TextView) view;
                                String text_msg = word.chinese;
                                Spanned s = (Spanned) tmpView.getText();
                                int start = s.getSpanStart(this);
                                int end = s.getSpanEnd(this);
                                String text_title = s.subSequence(start, end).toString();
                                String urlParameters = "wordId=" + word.wordID + "&url=" + word.getPassedUrl() + "&name=" + "zhengnaijia_19920112" + "&isRemembered=1";

                                try {
                                    String test =  new GetRequest().execute(NetworkUtils.BASE_URL,urlParameters).get();
                                } catch (InterruptedException | ExecutionException e) {
                                    e.printStackTrace();
                                }

                                if(word.isTest){
                                    //a quiz

                                }else{
                                    //example sentence
                                    alert.showDialog(TranslateBuildInActivity.this, text_title, text_msg, word);
                                }

                            }
                        };
                        ss.setSpan(clickableSpan, word.position, word.position + word.english.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    }

                    textView.setText(ss);
                    textView.setMovementMethod(LinkMovementMethod.getInstance());
                }
                break;
        }
        }
    };
}

