package com.example.naijia.wordnews;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import com.example.naijia.wordnews.APIRequest;

import java.io.InterruptedIOException;
import java.util.concurrent.ExecutionException;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        //String url = "http://wordnews-mobile.herokuapp.com/show?text=\"A car bomb attack on a military convoy in south-eastern Turkey has killed two soldiers and injured four others, Turkish officials say.\"&url=http://www.bbc.com/news/world-europe-33667427&name=id1450520015716_1&num_words=2";

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
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
