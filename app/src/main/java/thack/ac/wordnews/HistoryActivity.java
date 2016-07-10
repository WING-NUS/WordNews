package thack.ac.wordnews;

import android.content.Context;
import android.content.DialogInterface;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.Toolbar;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.IOException;
import java.io.InputStream;

public class HistoryActivity extends BaseActivity {
    WebView myWebView;
    public final String TAG = ((Object) this).getClass().getSimpleName();

    private String HISTORY_API = "http://wordnews-mobile.herokuapp.com/displayHistory";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        Log.d(TAG, android_id);

        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            String title = String.format("%s", getString(R.string.action_history));
            actionBar.setTitle(title);
        }

        myWebView = (WebView) findViewById(R.id.webview);
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        myWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

        });
        if(android_id != null) {
            String uri = Uri.parse(HISTORY_API)
                    .buildUpon()
                    .appendQueryParameter("name", android_id)
                    .build().toString();
            Log.d(TAG, uri);
            myWebView.loadUrl(uri);
        } else {
            Toast.makeText(this, "No user ID specified.", Toast.LENGTH_SHORT).show();
        }
    }
}
