package com.example.naijia.wordnews.activities;

import android.app.Activity;
import android.content.Context;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.Utils.ImageDownloader;
import com.example.naijia.wordnews.api.GetRequest;
import com.example.naijia.wordnews.api.PostRequest;
import com.example.naijia.wordnews.models.PostData;
import com.example.naijia.wordnews.models.Word;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class WordsHistoryList extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.words_history_list_listview);

        final ListView listview = (ListView) findViewById(R.id.history_list_listview);

        String translateWords = null;
        try {
            translateWords = new GetRequest()
                    .execute("http://wordnews-mobile.herokuapp.com/displayHistory.json", "name=zhengnaijia_19920112")
                    .get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        try {
            JSONArray historyListAsJson = new JSONArray(translateWords);

            final ArrayList<Word> list = new ArrayList<Word>();
            for (int i = 0; i < historyListAsJson.length(); i++) {
                Word w = new Word();

                JSONObject historyItem = historyListAsJson.getJSONObject(i);
                w.chinese = historyItem.getString("chinese_meaning");
                w.english = historyItem.getString("english_meaning");
                w.pronunciation = historyItem.getString("pronunciation");
                list.add(w);
            }
            final StableArrayAdapter adapter = new StableArrayAdapter(this, R.layout.words_history_list, list);
            listview.setAdapter(adapter);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private class StableArrayAdapter extends ArrayAdapter<Word> {

        private Activity myContext;
        private ArrayList<Word> datas;

        public StableArrayAdapter(Context context, int textViewResourceId, ArrayList<Word> objects) {
            super(context, textViewResourceId, objects);
            
            myContext = (Activity) context;
            datas = objects;
        }

        public View getView(int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater = myContext.getLayoutInflater();
            View rowView = inflater.inflate(R.layout.words_history_list, parent, false);

            TextView postTitleView = (TextView) rowView.findViewById(R.id.firstLine);

            postTitleView.setText(datas.get(position).english + "\t - \t" + datas.get(position).chinese);
            final ImageView image = (ImageView) rowView.findViewById(R.id.icon);
            image.setTag(position);

            image.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    MediaPlayer mediaPlayer;
                    String[] splitString = datas.get((int) image.getTag()).pronunciation.trim().split("\\s+");
                    for (int i = 0; i < splitString.length; i++) {
                        String pinyin = splitString[i];
                        String url = "http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/" + pinyin + ".mp3";
                        mediaPlayer = MediaPlayer.create(myContext, Uri.parse(url));
                        mediaPlayer.start();
                    }
                }
            });
            return rowView;
        }

        @Override
        public int getCount() {
            return datas.size();
        }

    }

}
