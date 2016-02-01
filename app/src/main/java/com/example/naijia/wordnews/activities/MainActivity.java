package com.example.naijia.wordnews.activities;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ListView;
import android.content.Intent;

import com.example.naijia.wordnews.api.IndexListViewUpdate;
import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.models.PostData;
import com.example.naijia.wordnews.models.QuizModel;

import java.util.ArrayList;
import java.util.Arrays;
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
//                Intent intent = new Intent(MainActivity.this, QuizActivity.class);
//                List<String> list = Arrays.asList("1.Ocassion", "2.Situation", "3.Time", "4.Playground");
//                QuizModel quiz = new QuizModel(getString(R.string.quiz_question),getString(R.string.quiz_question_trans),list,"Ocassion","Ocassion","n.");
//                Bundle mBundle = new Bundle();
//                mBundle.putParcelable("quiz",quiz);
//                intent.putExtras(mBundle);
//                startActivity(intent);
                Intent intent = new Intent(MainActivity.this, TranslateBuildInActivity.class);
                Bundle b = new Bundle();
                b.putString("key", listData[(int) id].postLink);
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
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}