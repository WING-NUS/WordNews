package com.example.naijia.wordnews;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.EventLogTags;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import android.content.Intent;

import com.example.naijia.wordnews.APIRequest;
import com.example.naijia.wordnews.IndexListViewUpdate;

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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public class MainActivity extends AppCompatActivity {
    private PostData[] listData;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        listData = new PostData[20];
        ListView listView = (ListView) this.findViewById(R.id.postListView);
        IndexListViewUpdate indexListView = new IndexListViewUpdate();
        indexListView.updateData(listData);
        List<PostData> list = new ArrayList<PostData>();
        for(PostData s : listData) {if(s != null) {list.add(s);}}
        listData = list.toArray(new PostData[list.size()]);
//        Log.d("LOG_DATA_LENGTH", String.valueOf(listData.length));
//        for(int i=0;i<listData.length;i++) {
//            Log.d("LOG_LISTDATA",String.valueOf(i));
//            Log.d("LOG_LISTDATA",String.valueOf(i) +" "+ listData[i].postLink);
//        }
        PostItemAdapter itemAdapter = new PostItemAdapter(this, R.layout.postitem, listData);
        listView.setAdapter(itemAdapter);
        final Activity activity = this;

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
                Log.d("API", response);
                Snackbar.make(view, response, Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(MainActivity.this, TranslateActivity.class);
                Bundle b = new Bundle();
                b.putString("key", listData[(int) id].postLink);
                intent.putExtras(b);
                startActivity(intent);
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
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
