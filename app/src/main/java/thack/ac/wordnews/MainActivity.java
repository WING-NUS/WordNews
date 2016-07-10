package thack.ac.wordnews;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends BaseActivity {
    private      Activity self = this;
    public final String   TAG  = ((Object) this).getClass().getSimpleName();

    //RecyclerView
    private RecyclerView               mRecyclerView;
    private MyAdapter                  mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    ArrayList<NewsItem> dataset;

    // Fri, 17 Jun 2016 07:02:38 GMT
    SimpleDateFormat format_BBC = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            String title = getString(R.string.app_name);
            actionBar.setTitle(title);
        }

        mRecyclerView = (RecyclerView) findViewById(R.id.recyclerview);
        // improve performance if you know that changes in content
        // do not change the size of the RecyclerView
        mRecyclerView.setHasFixedSize(true);

        // use a linear layout manager
        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // Create dataset
        dataset = new ArrayList<NewsItem>();

        // specify an adapter (see also next example)
        mAdapter = new MyAdapter(dataset);
        mRecyclerView.setAdapter(mAdapter);
        mAdapter.setOnItemClickListener(new OnItemClickListener() {

            @Override
            public void onItemClick(View v, int position) {
                Intent intent = new Intent();
                intent.putExtra("pos", position);
                intent.putExtra("source", dataset.get(position).getSource());
                intent.putExtra("url", dataset.get(position).getUrl());
                intent.putExtra("time", dataset.get(position).getExactTime());
                intent.setClass(self, NewsItemActivity.class);
                startActivity(intent);
            }
        });

        // set item animator to DefaultAnimator
        mRecyclerView.setItemAnimator(new DefaultItemAnimator());

        new RetrieveRSSTask().execute("http://feeds.bbci.co.uk/news/rss.xml");
    }

    class RetrieveRSSTask extends AsyncTask<String, Void, Void> {

        protected Void doInBackground(String... urls) {
            Log.d(TAG, "retrieving RSS...");
            try {
                URL url = new URL(urls[0]);

                XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
                factory.setNamespaceAware(false);
                XmlPullParser xpp = factory.newPullParser();

                // We will get the XML from an input stream
                xpp.setInput(getInputStream(url), "UTF_8");

        /* We will parse the XML content looking for the "<title>" tag which appears inside the "<item>" tag.
         * However, we should take in consideration that the rss feed name also is enclosed in a "<title>" tag.
         * As we know, every feed begins with these lines: "<channel><title>Feed_Name</title>...."
         * so we should skip the "<title>" tag which is a child of "<channel>" tag,
         * and take in consideration only "<title>" tag which is a child of "<item>"
         *
         * In order to achieve this, we will make use of a boolean variable.
         */
                boolean insideItem = false;

                String headline = "";
                String link = "";
                String pictureUrl = "";
                String dateStr = "";
                Date date = new Date();

                // Returns the type of current event: START_TAG, END_TAG, etc..
                int eventType = xpp.getEventType();
                while (eventType != XmlPullParser.END_DOCUMENT) {
                    if (eventType == XmlPullParser.START_TAG) {

                        if (xpp.getName().equalsIgnoreCase("item")) {
                            insideItem = true;
                        } else if (xpp.getName().equalsIgnoreCase("title")) {
                            if (insideItem) {
                                headline = xpp.nextText();
//                                Log.e(TAG, "headline: " + headline);
                            }
                        } else if (xpp.getName().equalsIgnoreCase("link")) {
                            if (insideItem) {
                                link = xpp.nextText();
//                                Log.e(TAG, "link: " + link);
                            }
                        } else if (xpp.getName().equalsIgnoreCase("media:thumbnail")) {
                            if (insideItem) {
                                pictureUrl = xpp.getAttributeValue(null, "url");
//                                Log.e(TAG, "media:thumbnail: " + pictureUrl); //extract the link of article picture
                            }
                        } else if (xpp.getName().equalsIgnoreCase("pubDate")) {
                            if (insideItem) {
                                dateStr = xpp.nextText();
//                                Log.e(TAG, "pubDate: " + dateStr);
                                try {
                                    date = format_BBC.parse(dateStr);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        } else {
//                            Log.e(TAG, "others" + xpp.getName());
                        }
                    } else if (eventType==XmlPullParser.END_TAG && xpp.getName().equalsIgnoreCase("item")) {
                        insideItem = false;
                        NewsItem item = new NewsItem(headline, link, date, pictureUrl, "BBC");
                        dataset.add(item);
                    }

                    eventType = xpp.next(); //move to next element
                }

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (XmlPullParserException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }

        public InputStream getInputStream(URL url) {
            try {
                return url.openConnection().getInputStream();
            } catch (IOException e) {
                e.printStackTrace();
                Log.e(TAG, "getInputStream error");
                return null;
            }
        }

        protected void onPostExecute(Void param) {
            //Notify the adapter
            for (NewsItem item : dataset) {
                //                Log.e(TAG, item.toString());
            }
            Log.d(TAG, "RSS retrieved.");
            mAdapter.notifyDataSetChanged();
            //            myWebView.loadData(html, "text/html", "UTF-8");
            //            myWebView.loadUrl("http://www.bbc.com/news/world-middle-east-36410982");
            //            myWebView.loadUrl("http://edition.cnn.com/2016/05/30/middleeast/iraq-operation-falluja/index.html");
        }
    }
}
