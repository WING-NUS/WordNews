package com.example.naijia.wordnews;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class TranslateActivity extends AppCompatActivity {
    private WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        final Activity activity = this;

        Bundle b = getIntent().getExtras();
        String passedURL = b.getString("key");

        webView = (WebView) findViewById(R.id.activity_main_webview);
        webView.setVerticalScrollBarEnabled(true);
        webView.setHorizontalScrollBarEnabled(true);
        webView.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
                String javascript = "javascript: "+js;
                view.loadUrl(javascript);
                Log.d("PAGE_LOADED", "PAGE_LOADED");
            }
        });
        webView.getSettings().setJavaScriptEnabled(true);

//        webView.setWebChromeClient(new WebChromeClient() {
//            public void onProgressChanged(WebView view, int progress) {
//                activity.setProgress(progress * 1000);
//            }
//        });
//        webView.setWebViewClient(new WebViewClient() {
//            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
//                Toast.makeText(activity, "Oh no! " + description, Toast.LENGTH_SHORT).show();
//            }
//        });
        webView.loadUrl(passedURL);
        Log.d("DisplayNewsLink", passedURL);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
    private String js = "";

}

