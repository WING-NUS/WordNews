package com.example.naijia.wordnews.activities;

import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
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
import com.example.naijia.wordnews.models.Word;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.ExecutionException;

public class TranslateBuildInActivity extends AppCompatActivity {
    private String url;
    private String passedURL;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate_buildin);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        LinearLayout linearLayout = (LinearLayout)findViewById(R.id.dynamic_linear_layout);

        Bundle b = getIntent().getExtras();
        passedURL = b.getString("key");

        url = "http://wordnews-mobile.herokuapp.com/articleContents?url=";

        //TODO: unable to make GET request to the passed in URL
        url += passedURL;

        //url = "http://wordnews-mobile.herokuapp.com/articleContents?url=http://edition.cnn.com/2015/08/27/sport/world-athletics-championship-200m-final/index.html";
        Log.d("URL", url);

    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        if(hasFocus){
            Log.d("JSON STRING", "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
            try {
                LinearLayout linearLayout = (LinearLayout)findViewById(R.id.dynamic_linear_layout);
                String response = "";
                response = new APIRequest().execute(url).get();
                Log.d("WindowFocus URL", url);
                Log.d("WindowFocus RESPONSE", response);
                JSONObject jObject = new JSONObject(response);
                int i = 0;
                ArrayList<String> paragraphs = new ArrayList<String>();
                while(true)
                {
                    String key = new Integer(i).toString();
                    if(jObject.has(key)) {
                        String aJsonString = jObject.getString(key);
                        JSONObject innerJObject = new JSONObject(aJsonString);
                        paragraphs.add(innerJObject.getString("text"));
                        Log.d("PARAGRAPH", innerJObject.getString("text"));
                    }
                    else {
                        break;
                    }
                    i++;
                }
                for(final String paragraph : paragraphs) {
                    String urlParameters = "text="+paragraph+"&url="+passedURL+"&name="+"zhengnaijia_19920112"+"&num_words="+"3";
                    String translateUrl = "http://wordnews-mobile.herokuapp.com/show/";
                    String translate_words = new PostRequest().execute(translateUrl,urlParameters).get();

                    if(translate_words=="FAILED"){
                        i++;
                        continue;
                    }
                    //parameters used: paragraph, linearLayout

                    SpannableString ss = new SpannableString(paragraph);
                    TextView textView = new TextView(getApplicationContext());
                    textView.setTextSize(18);
                    textView.setTextColor(Color.parseColor("#ff000000"));
                    linearLayout.addView(textView);

                    // parse the returned JSON
                    JSONObject translateJSONObject = new JSONObject(translate_words);
                    ArrayList<Word> words = new ArrayList<Word>();
                    Iterator<String> keys = translateJSONObject.keys();
                    while(keys.hasNext()) {
                        String english = (String) keys.next();
                        JSONObject wordJson = new JSONObject(translateJSONObject.getString(english));
                        Log.d("TRANSLATE WORDSssssss", english);
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


                    for (final Word word : words) {
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
            } catch (ExecutionException | JSONException | InterruptedException e) {
                Log.d("ERROR", e.toString());
            }

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

