package com.example.naijia.wordnews.activities;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import com.example.naijia.wordnews.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WordsHistoryList extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.words_history_list_listview);

        final ListView listview = (ListView) findViewById(R.id.listview);
        String[] values = new String[] { "Android\r\t-\r\t安卓", "Android\r\t-\r\t安卓",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r\t-\r\t回答", "apple\r\t-\r\t苹果",
                "Android\r\t-\r\t安卓", "answer\r-\r回答", "apple-苹果"};

        final ArrayList<String> list = new ArrayList<String>();
        for (int i = 0; i < values.length; ++i) {
            list.add(values[i]);
        }
        final StableArrayAdapter adapter = new StableArrayAdapter(this, android.R.layout.simple_list_item_1, list);
        listview.setAdapter(adapter);
    }

    private class StableArrayAdapter extends ArrayAdapter<String> {

        HashMap<String, Integer> mIdMap = new HashMap<String, Integer>();

        public StableArrayAdapter(Context context, int textViewResourceId,
                                  List<String> objects) {
            super(context, textViewResourceId, objects);
            for (int i = 0; i < objects.size(); ++i) {
                mIdMap.put(objects.get(i), i);
            }
        }

        @Override
        public long getItemId(int position) {
            String item = getItem(position);
            return mIdMap.get(item);
        }

        @Override
        public boolean hasStableIds() {
            return true;
        }

    }

}
