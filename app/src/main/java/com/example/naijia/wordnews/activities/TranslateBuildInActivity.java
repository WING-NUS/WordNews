package com.example.naijia.wordnews.activities;

import android.graphics.Color;
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
import android.view.Menu;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.naijia.wordnews.api.APIRequest;
import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.Utils.ViewDialog;

import com.example.naijia.wordnews.api.PostRequest;
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
    private static final int UPDATE_UI = 1;
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

        url = "http://wordnews-mobile.herokuapp.com/articleContents?url=";

        //TODO: unable to make GET request to the passed in URL
        url += passedURL;

        //url = "http://wordnews-mobile.herokuapp.com/articleContents?url=http://edition.cnn.com/2015/08/27/sport/world-athletics-championship-200m-final/index.html";
        Log.d("URL", url);
        fetchParagraph();
    }

    private void parseXMLResponse(String mainContent) {
        try {
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            XmlPullParser xpp = factory.newPullParser();
            xpp.setInput(new StringReader(mainContent));
            int eventType = xpp.getEventType();
            String nameTag = "";
            boolean isParagraph = false;
            while (eventType != XmlPullParser.END_DOCUMENT) {

                if (eventType == XmlPullParser.START_DOCUMENT) {
                    //do something
                } else if (eventType == XmlPullParser.START_TAG) {
                    if (nameTag.equals("p")){
                        isParagraph = true;
                    }
                    nameTag = xpp.getName();
                } else if (eventType == XmlPullParser.END_TAG) {
                    if(nameTag.equals("p")) {
                        isParagraph = false;
                    }
                } else if (eventType == XmlPullParser.TEXT) {
                    if(isParagraph){
                        Log.d("ONE PARAGRAPH",xpp.getText());
                    }
                } else {
                    Log.d("LOG_UNKNOWN_DATA","LOG_UNKNOWN_DATA");
                    Log.d("LOG_UNKNOWN_DATA",xpp.getText());
                }
                eventType = xpp.next();
            }
        } catch (IOException | XmlPullParserException e){
            Log.d("ERROR:", e.toString());
        }
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
                Log.d("PARAGRAPH", mainContent.substring(index1 + 3, index2));
                index1 = mainContent.indexOf("<p>", index1 + 1);
                index2 = mainContent.indexOf("</p>", index2 + 1);
                TextView textView = new TextView(getApplicationContext());
                textView.setTextSize(18);
                textView.setId(i);
                textView.setTextColor(Color.parseColor("#ff000000"));
                linearLayout.addView(textView);

                if(index1+3 < mainContent.length() && index2 < mainContent.length() && index2>index1+3) {
                    String paragraph = mainContent.substring(index1+3,index2);
                    paragraphs.put(i, paragraph);
                    textView.setText(paragraph);

                    Log.d("PARAGRAPH", paragraph);
                    i++;
                }
                else{
                    break;
                }
            }

//            String response = "";
//            response = new APIRequest().execute(url).get();
//            Log.d("WindowFocus URL", url);
//            Log.d("WindowFocus RESPONSE", response);
//            JSONObject jObject = new JSONObject(response);
//
//
//            while(true)
//            {
//                String key = new Integer(i).toString();
//                if(jObject.has(key)) {
//                    TextView textView = new TextView(getApplicationContext());
//                    textView.setTextSize(18);
//                    textView.setId(i);
//                    textView.setTextColor(Color.parseColor("#ff000000"));
//                    linearLayout.addView(textView);
//
//                    String aJsonString = jObject.getString(key);
//                    JSONObject innerJObject = new JSONObject(aJsonString);
//                    String paragraph = innerJObject.getString("text");
//                    paragraphs.put(i, paragraph);
//                    textView.setText(paragraph);
//
//                    Log.d("PARAGRAPH", paragraph);
//                }
//                else {
//                    break;
//                }
//                i++;
//            }
        }
        catch (ExecutionException | InterruptedException e) {
            Log.d("ERROR", e.toString());
        }
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
                                    alert.showDialog(TranslateBuildInActivity.this, text_title, text_msg);
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

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        if(hasFocus){
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

                                if(!translate_words.equals("FAILED")){
                                    // parse the returned JSON
                                    JSONObject translateJSONObject = new JSONObject(translate_words);
                                    ArrayList<Word> words = new ArrayList<Word>();
                                    Iterator<String> keys = translateJSONObject.keys();
                                    Word initialWord = new Word();
                                    initialWord.paragraph = paragraph;
                                    initialWord.paragraphID = key;
                                    words.add(initialWord);
                                    while(keys.hasNext()) {
                                        String english = (String) keys.next();
                                        JSONObject wordJson = new JSONObject(translateJSONObject.getString(english));
                                        Log.d("TRANSLATE WORDS", english);
                                        Word word = new Word();
                                        word.english = english;
                                        word.chinese = wordJson.getString("chinese");
                                        word.wordID = wordJson.getString("wordID");
                                        word.position = wordJson.getInt("position");
                                        word.pronunciation = wordJson.getString("pronunciation");
                                        Integer isTest = wordJson.getInt("isTest");
                                        if(isTest==0)
                                            word.isTest = Boolean.FALSE;
                                        else
                                            word.isTest = Boolean.TRUE;
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

//            try {
//                for(final String paragraph : paragraphs) {
//                    String urlParameters = "text="+paragraph+"&url="+passedURL+"&name="+"zhengnaijia_19920112"+"&num_words="+"3";
//                    String translateUrl = "http://wordnews-mobile.herokuapp.com/show/";
//                    String translate_words = new PostRequest().execute(translateUrl,urlParameters).get();
//
//                    if(translate_words=="FAILED"){
//                        continue;
//                    }
//
//                    // parse the returned JSON
//                    JSONObject translateJSONObject = new JSONObject(translate_words);
//                    ArrayList<Word> words = new ArrayList<Word>();
//                    Iterator<String> keys = translateJSONObject.keys();
//                    while(keys.hasNext()) {
//                        String english = (String) keys.next();
//                        JSONObject wordJson = new JSONObject(translateJSONObject.getString(english));
//                        Log.d("TRANSLATE WORDSssssss", english);
//                        Word word = new Word();
//                        word.english = english;
//                        word.chinese = wordJson.getString("chinese");
//                        word.wordID = wordJson.getString("wordID");
//                        word.position = wordJson.getInt("position");
//                        word.pronunciation = wordJson.getString("pronunciation");
//                        Integer isTest = wordJson.getInt("isTest");
//                        if(isTest==0)
//                            word.isTest = Boolean.FALSE;
//                        else
//                            word.isTest = Boolean.TRUE;
//                        words.add(word);
//                        // TODO: Use this result for check isTest and pronunciation etc
//                    }
//
//                    SpannableString ss = new SpannableString(paragraph);
//                    TextView textView = new TextView(getApplicationContext());
//                    textView.setTextSize(18);
//                    textView.setTextColor(Color.parseColor("#ff000000"));
//                    linearLayout.addView(textView);
//
//                    for (final Word word : words) {
//                        ClickableSpan clickableSpan = new ClickableSpan() {
//                            @Override
//                            public void onClick(View view) {
//                                ViewDialog alert = new ViewDialog();
//                                TextView tmpView = (TextView) view;
//                                String text_msg = word.chinese;
//                                Spanned s = (Spanned) tmpView.getText();
//                                int start = s.getSpanStart(this);
//                                int end = s.getSpanEnd(this);
//                                String text_title = s.subSequence(start, end).toString();
//                                alert.showDialog(TranslateBuildInActivity.this, text_title, text_msg);
//                            }
//                        };
//                        ss.setSpan(clickableSpan, word.position, word.position + word.english.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
//                    }
//
//                    textView.setText(ss);
//                    textView.setMovementMethod(LinkMovementMethod.getInstance());
//                }
//            } catch (ExecutionException | JSONException | InterruptedException e) {
//                Log.d("ERROR", e.toString());
//            }

        }
    }
    class loadComments extends AsyncTask<String, String, String> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onProgressUpdate(String... values) {
            super.onProgressUpdate(values);

        }

        @Override
        protected String doInBackground(String... params) {
            return null;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
}

