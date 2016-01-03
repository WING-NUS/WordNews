package com.example.naijia.wordnews;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ListView;

import com.example.naijia.wordnews.APIRequest;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;
import java.io.StringReader;
import java.util.concurrent.ExecutionException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public class MainActivity extends AppCompatActivity {
    private PostData[] listData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        try{
            String url = "http://rss.cnn.com/rss/edition.rss";
            //String xmlRecords = "<data><terminal_id>1000099999</terminal_id><merchant_id>10004444</merchant_id><merchant_info>Mc Donald's - Abdoun</merchant_info></data>";
            String response = "";
            try {
                response = new APIRequest().execute(url).get();
            } catch (ExecutionException | InterruptedException e) {
                //DO something
            }

            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            XmlPullParser xpp = factory.newPullParser();
            xpp.setInput(new StringReader(response));
            int eventType = xpp.getEventType();
            PostData data = null;
            listData = new PostData[100];
            int count = 0;
            data = new PostData();
            data.postDate = "";
            data.postTitle = "";
            data.postThumbUrl = null;
            String nameTag = "";
            while (eventType != XmlPullParser.END_DOCUMENT) {

                if (eventType == XmlPullParser.START_DOCUMENT) {
                    //do something
                } else if (eventType == XmlPullParser.START_TAG) {
                    nameTag = xpp.getName();
                } else if (eventType == XmlPullParser.END_TAG) {
                    if(xpp.getName().equals("item")) {
                        Log.d("LOG",data.postTitle);
                        listData[count] = data;
                        count++;
                        if(count>10) break;
                        data = new PostData();
                        data.postDate = "";
                        data.postTitle = "";
                        data.postThumbUrl = null;
                    }
                } else if (eventType == XmlPullParser.TEXT) {
                    if(nameTag.equals("title")){
                        data.postTitle = xpp.getText();
                    } else if (nameTag.equals("pubDate")){
                        data.postDate = xpp.getText();
                    }
                }
                eventType = xpp.next();
            }
            for(int i=0;i<10;i++){
                Log.d("LOG_FINAL", listData[i].postTitle);
            }
            ListView listView = (ListView) this.findViewById(R.id.postListView);
            PostItemAdapter itemAdapter = new PostItemAdapter(this,
                    R.layout.postitem, listData);
            listView.setAdapter(itemAdapter);
//        } catch (ParserConfigurationException | IOException | SAXException | XmlPullParserException e){
        } catch (IOException | XmlPullParserException e){
            this.generateDummyData();
            ListView listView = (ListView) this.findViewById(R.id.postListView);
            PostItemAdapter itemAdapter = new PostItemAdapter(this,
                    R.layout.postitem, listData);
            listView.setAdapter(itemAdapter);
        }

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //String url = "http://wordnews-mobile.herokuapp.com/show?text=\"A car bomb attack on a military convoy in south-eastern Turkey has killed two soldiers and injured four others, Turkish officials say.\"&url=http://www.bbc.com/news/world-europe-33667427&name=id1450520015716_1&num_words=2";
                //String url = "http://wordnews-mobile.herokuapp.com/remember?name=id1450520015716_1&wordID=16381&isRemembered=1&url=http://www.bbc.com/news/world-europe-33667427";
                String url = "http://wordnews-mobile.herokuapp.com/getNumber?name=id1450520015716_1";
                String response = "";
                try {
                    response = new APIRequest().execute(url).get();
                } catch (ExecutionException | InterruptedException e) {
                    //DO something
                }
                Log.d("API",response);
                Snackbar.make(view, response, Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    private void generateDummyData() {
        PostData data = null;
        listData = new PostData[10];
        for (int i = 0; i < 10; i++) { //please ignore this comment :>
            data = new PostData();
            data.postDate = "May 20, 2013";
            data.postTitle = "Post " + (i + 1) + " Title: This is the Post Title from RSS Feed";
            data.postThumbUrl = null;
            listData[i] = data;
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
