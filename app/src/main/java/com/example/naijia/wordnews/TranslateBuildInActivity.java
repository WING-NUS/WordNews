package com.example.naijia.wordnews;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

public class TranslateBuildInActivity extends AppCompatActivity {
    String text_content;
    SpannableString ss;
    String[] words;
    TextView textView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate_buildin);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Bundle b = getIntent().getExtras();
        String passedURL = b.getString("key");

        textView = (TextView) findViewById(R.id.text_translate);


        text_content = "On Parrott's wedding last weekend, " +
                "her loyal pup was right by her side to help calm her down. " +
                "Maddie Peschong, photographer and owner of Mad Photo & Design, " +
                "was there to capture this touching moment as " +
                "Valerie married Andrew Parrott.";
        ss = new SpannableString(text_content);
        words = text_content.split(" ");

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
            ss.setSpan(clickableSpan, text_content.indexOf(word), text_content.indexOf(word) + word.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        textView.setText(ss);
        textView.setMovementMethod(LinkMovementMethod.getInstance());
    }

    public void toggle_contents(View v){

    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
    private String js = "";

}

