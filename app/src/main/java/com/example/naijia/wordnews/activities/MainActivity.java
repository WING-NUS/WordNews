package com.example.naijia.wordnews.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ListView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.api.IndexListViewUpdate;
import com.example.naijia.wordnews.models.PostData;

import java.util.ArrayList;
import java.util.List;

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

        PostItemAdapter itemAdapter = new PostItemAdapter(this, R.layout.postitem, listData);
        listView.setAdapter(itemAdapter);
        final Activity activity = this;

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(MainActivity.this, TranslateBuildInActivity.class);
                Bundle b = new Bundle();
                b.putString("key", listData[(int) id].postLink);
                b.putString("title", listData[(int) id].postTitle);
                intent.putExtras(b);
                startActivity(intent);
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            Intent i = new Intent(this, SettingActivity.class);
            startActivity(i);
            //return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
