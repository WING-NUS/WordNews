package com.example.naijia.wordnews.activities;

import android.app.Activity;
import android.content.Context;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
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
import com.example.naijia.wordnews.models.PostData;
import com.example.naijia.wordnews.models.Word;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WordsHistoryList extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.words_history_list_listview);

        final ListView listview = (ListView) findViewById(R.id.history_list_listview);

        final ArrayList<Word> list = new ArrayList<Word>();
        for (int i = 0; i < 100; ++i) {
            Word w = new Word();
            w.chinese = "中文";
            w.english = "English";
            list.add(w);
        }
        final StableArrayAdapter adapter = new StableArrayAdapter(this, R.layout.words_history_list, list);
        listview.setAdapter(adapter);
    }

    private class StableArrayAdapter extends ArrayAdapter<Word> {

        private Activity myContext;
        private ArrayList<Word> datas;

        public StableArrayAdapter(Context context, int textViewResourceId, ArrayList<Word> objects) {
            super(context, textViewResourceId, objects);
            // TODO Auto-generated constructor stub
            myContext = (Activity) context;
            datas = objects;
        }

        public View getView(int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater = myContext.getLayoutInflater();
            View rowView = inflater.inflate(R.layout.words_history_list, parent, false);

            TextView postTitleView = (TextView) rowView
                    .findViewById(R.id.firstLine);
            postTitleView.setText(datas.get(position).english + "\t - \t" + datas.get(position).chinese);
            ImageView image = (ImageView) rowView.findViewById(R.id.icon);
            image.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    MediaPlayer mediaPlayer;
                        String[] splitString = "pin1 yin1".split("\\s+");
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
