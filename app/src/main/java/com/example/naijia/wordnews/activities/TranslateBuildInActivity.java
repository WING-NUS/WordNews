package com.example.naijia.wordnews.activities;

import android.graphics.Color;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutionException;

public class TranslateBuildInActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate_buildin);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        LinearLayout linearLayout = (LinearLayout)findViewById(R.id.dynamic_linear_layout);;

        Bundle b = getIntent().getExtras();
        String passedURL = b.getString("key");

        String url = "http://wordnews-mobile.herokuapp.com/articleContents?url=";
        url += passedURL;
        url = "http://wordnews-mobile.herokuapp.com/articleContents?url=http://edition.cnn.com/2015/08/27/sport/world-athletics-championship-200m-final/index.html";
        Log.d("URL", url);
        String response = "";
        try {
            response = new APIRequest().execute(url).get();
            Log.d("JSON STRING", response);
            JSONObject jObject = new JSONObject(response);
            int i = 0;
            while(true)
            {
                String key = new Integer(i).toString();
                if(jObject.has(key))
                {
                    String aJsonString = jObject.getString(key);
                    JSONObject innerJObject = new JSONObject(aJsonString);
                    String paragraph = innerJObject.getString("text");
                    Log.d("JSON STRING", paragraph);

                    String urlParameters = "text="+paragraph+"&url="+passedURL+"&name="+"zhengnaijia_19920112"+"&num_words="+"3";
                    String translateUrl = "http://wordnews-mobile.herokuapp.com/show/";
                    String translate_words = new PostRequest().execute(translateUrl,urlParameters).get();
                    Log.d("TRANSLATE WORDS", translate_words);

                    TextView textView = new TextView(this);
                    textView.setTextSize(18);
                    textView.setTextColor(Color.parseColor("#ff000000"));
                    linearLayout.addView(textView);

                    SpannableString ss = new SpannableString(paragraph);
                    String[] words = paragraph.split(" ");

                    for(final String word : words){
                        ClickableSpan clickableSpan = new ClickableSpan() {
                            @Override
                            public void onClick(View view) {
                                ViewDialog alert = new ViewDialog();
                                TextView tmpView = (TextView) view;
                                String text_msg="n. 故事；小说；新闻报道；来历；假话\n" +
                                        "vt. 用历史故事画装饰\n" +
                                        "vi. 说谎\n" +
                                        "n. (Story)人名；(英)斯托里";
                                Spanned s = (Spanned) tmpView.getText();
                                int start = s.getSpanStart(this);
                                int end = s.getSpanEnd(this);
                                String text_title = s.subSequence(start, end).toString();
                                alert.showDialog(TranslateBuildInActivity.this, text_title, text_msg);
                            }
                        };
                        ss.setSpan(clickableSpan, paragraph.indexOf(word), paragraph.indexOf(word) + word.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    }

                    textView.setText(ss);
                    textView.setMovementMethod(LinkMovementMethod.getInstance());

                }
                else{
                    break;
                }
                i++;
            }
        } catch (ExecutionException | JSONException | InterruptedException e) {
            Log.d("ERROR", e.toString());
        }



    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
}

