package thack.ac.wordnews;

import android.content.Context;
import android.content.DialogInterface;
import android.os.AsyncTask;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends AppCompatActivity {
    WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

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

                injectScriptFile(view, "js/app.js");

                injectCSS(view, "gt_popup_css_compiled.css");
                injectCSS(view, "gt_bubble_gss.css");
                injectCSS(view, "slider/css/slider.css");

                // init JS
                view.loadUrl("javascript:setTimeout(init(), 100)");
            }

            // Inject CSS method: read style.css from assets folder
            // Append stylesheet to document head
            private void injectCSS(WebView view, String scriptFile) {
                try {
                    InputStream inputStream = getAssets().open(scriptFile);
                    byte[] buffer = new byte[inputStream.available()];
                    inputStream.read(buffer);
                    inputStream.close();
                    String encoded = Base64.encodeToString(buffer, Base64.NO_WRAP);
                    view.loadUrl("javascript:(function() {" +
                            "var parent = document.getElementsByTagName('head').item(0);" +
                            "var style = document.createElement('style');" +
                            "style.type = 'text/css';" +
                            // Tell the browser to BASE64-decode the string into your script !!!
                            "style.innerHTML = window.atob('" + encoded + "');" +
                            "parent.appendChild(style)" +
                            "})()");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }


            private void injectScriptFile(WebView view, String scriptFile) {
                InputStream input;
                try {
                    input = getAssets().open(scriptFile);
                    byte[] buffer = new byte[input.available()];
                    input.read(buffer);
                    input.close();

                    // String-ify the script byte-array using BASE64 encoding !!!
                    String encoded = Base64.encodeToString(buffer, Base64.NO_WRAP);
                    view.loadUrl("javascript:(function() {" +
                            "var parent = document.getElementsByTagName('head').item(0);" +
                            "var script = document.createElement('script');" +
                            "script.type = 'text/javascript';" +
                            // Tell the browser to BASE64-decode the string into your script !!!
                            "script.innerHTML = window.atob('" + encoded + "');" +
                            "parent.appendChild(script)" +
                            "})()");
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        });
        myWebView.addJavascriptInterface(new WebAppInterface(this), "Android");
//        new RetrieveHTMLTask().execute("http://edition.cnn.com/2016/05/30/middleeast/iraq-operation-falluja/index.html");
        new RetrieveHTMLTask().execute("http://www.bbc.com/news/world-middle-east-36410982");
    }

    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void showDialog(String text) {
            new AlertDialog.Builder(mContext)
                    .setTitle("From Web page")
                    .setMessage(text)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            // do nothing
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_info)
                    .show();
        }
    }

    class RetrieveHTMLTask extends AsyncTask<String, Void, String> {

        private Exception exception;

        protected String doInBackground(String... urls) {
            String html = "";
//            try {
//                HttpClient client = new DefaultHttpClient();
//                HttpGet request = new HttpGet(urls[0]);
//                HttpResponse response = client.execute(request);
//
//                InputStream in = response.getEntity().getContent();
//                BufferedReader reader = new BufferedReader(new InputStreamReader(in));
//                StringBuilder str = new StringBuilder();
//                String line = null;
//                while((line = reader.readLine()) != null)
//                {
//                    str.append(line);
//                }
//                in.close();
//                html = str.toString();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
            return html;
        }

        protected void onPostExecute(String html) {
//            myWebView.loadData(html, "text/html", "UTF-8");
            myWebView.loadUrl("http://www.bbc.com/news/world-middle-east-36410982");
//            myWebView.loadUrl("http://edition.cnn.com/2016/05/30/middleeast/iraq-operation-falluja/index.html");
        }
    }
}
