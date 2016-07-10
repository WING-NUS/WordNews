package com.example.naijia.wordnews.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.naijia.wordnews.Utils.NetworkUtils;
import com.example.naijia.wordnews.api.APIRequest;
import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.Utils.ViewDialog;

import com.example.naijia.wordnews.api.PostRequest;
import com.example.naijia.wordnews.api.GetRequest;
import com.example.naijia.wordnews.models.QuizModel;
import com.example.naijia.wordnews.models.Word;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import java.net.URLEncoder;
import java.util.ArrayList;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class TranslateBuildInActivity extends AppCompatActivity {
    private String url;
    private String passedURL;
    private String title;
    private String date;
    private static final int UPDATE_UI = 1;
    private boolean notTranslated = true;
    Map<Integer, String> paragraphs;
    LinearLayout linearLayout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_translate_buildin);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        linearLayout = (LinearLayout)findViewById(R.id.dynamic_linear_layout);

        Bundle b = getIntent().getExtras();
        passedURL = b.getString("key");
        title = b.getString("title");
        date = b.getString("date");

        TextView textView = (TextView)findViewById(R.id.translate_title);
        textView.setTextSize(22);
        textView.setTextColor(Color.parseColor("#ff000000"));
        textView.setText(title);
        textView.setGravity(Gravity.CENTER);
        textView.setTypeface(Typeface.SANS_SERIF, Typeface.BOLD);
        textView.setLineSpacing((float) 1.3, (float) 1.3);

        textView = (TextView)findViewById(R.id.translate_date);
        textView.setTextSize(16);
        textView.setTextColor(Color.parseColor("#ff000000"));
        textView.setText(date);
        textView.setTypeface(Typeface.SANS_SERIF);
        textView.setLineSpacing((float) 1, (float) 1);

        fetchParagraph();
    }

    private void fetchParagraph() {
        try{
            paragraphs = new LinkedHashMap<Integer, String>();
            int i = 0;
            String mainContent = "";
            mainContent = new APIRequest().execute(passedURL).get();
            Log.d("WindowFocus URL", passedURL);
            Log.d("WindowFocus RESPONSE", mainContent);

            ArrayList<Integer> imageIndex = new ArrayList<Integer>();
            ArrayList<String> imageURL = new ArrayList<String>();

            int index1 = mainContent.indexOf("<p>");
            int index2 = mainContent.indexOf("</p>");
            while (index1 >= 0 && index2 >= 0) {
                if(index1+3 < mainContent.length() && index2 < mainContent.length() && index2>index1+3) {
                    String paragraph = mainContent.substring(index1+3, index2);
                    Log.d("PARAGRAPH BEFORE", paragraph);
                    int pair1, pair2;
                    while(true) {
                        pair1 = paragraph.indexOf('<');
                        pair2 = paragraph.indexOf('>');
                        if(pair1 < pair2) {
                            String outString = paragraph.substring(pair1, pair2 + 1);
                            Log.d("EXTRA STRING", outString);
                            if(outString.startsWith("<img")) {
                                String splits[] = outString.split("\\\\\"");
                                for(int j=0;j<splits.length;j++) {
                                    if(splits[j].startsWith("http:")) {
                                        Log.d("EXTRA STRING!!!!!!!!!!!", splits[j]);
                                        imageIndex.add(paragraphs.size());
                                        imageURL.add(splits[j]);
                                    }
                                }
                            }
                            paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair2+1);
                        }
                        else{
                            break;
                        }
                    }
                    while(true) {
                        pair1 = paragraph.indexOf('[');
                        pair2 = paragraph.indexOf(']');
                        if(pair1 < pair2) {
                            Log.d("EXTRA STRING", paragraph.substring(pair1, pair2+1));
                            paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair2+1);
                        }
                        else{
                            break;
                        }
                    }
                    ArrayList<String> patterns = new ArrayList<String>();
                    patterns.add("&nbsp;");
                    patterns.add("&pound;");
                    for(int index=0;index<patterns.size();index++) {
                        String pattern = patterns.get(index);
                        while(true){
                            pair1 = paragraph.indexOf(pattern);
                            if(pair1>=0)
                                paragraph = paragraph.substring(0,pair1) + paragraph.substring(pair1+pattern.length());
                            else
                                break;
                        }
                    }
                    paragraph = paragraph.replaceAll("&rsquo;","'");
                    paragraph = paragraph.replaceAll("&quot;","'");
                    paragraph = paragraph.replaceAll("&#39;","'");
                    paragraph = paragraph.replaceAll("&rdquo;","\"");
                    paragraph = paragraph.replaceAll("&ldquo;","\"");
                    paragraph = paragraph.replaceAll("&amp;","&");
                    paragraph = paragraph.replaceAll("&ndash;","–");
                    paragraph = paragraph.replaceAll("&mdash;","—");
                    paragraph = paragraph.replaceAll("\\\\\"","\"");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    paragraph = paragraph.replaceAll("\\\\r\\\\n\\\\r\\\\n","\\\\r\\\\n");
                    String[] splitParagraph = paragraph.split("\\\\r\\\\n");
                    int index = 0;
                    for(int j=0;j<splitParagraph.length;j++) {
                        String newParagraph = "\n" + splitParagraph[j];
                        TextView textView = new TextView(getApplicationContext());
                        textView.setTextSize(18);
                        textView.setId(i);
                        textView.setTextColor(Color.parseColor("#ff000000"));
                        textView.setTypeface(Typeface.SANS_SERIF);
                        textView.setLineSpacing((float) 1.3, (float) 1.3);
                        linearLayout.addView(textView);
                        textView.setText(newParagraph);
                        paragraphs.put(i++, newParagraph);
                        if(imageIndex.size()>index && index == j) {
                            ImageView myImage = new ImageView(this);
                            Picasso.with(getApplicationContext()).load(imageURL.get(index)).into(myImage);
                            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                            lp.setMargins(5, 40, 0, -15);
                            myImage.setLayoutParams(lp);
//                            myImage.setImageResource(R.drawable.ic_launcher);
                            linearLayout.addView(myImage);
//                            setContentView(linearLayout);
                            index++;
                        }
                    }
                }
                index1 = mainContent.indexOf("<p>", index1 + 1);
                index2 = mainContent.indexOf("</p>", index2 + 1);
            }
        }
        catch (ExecutionException | InterruptedException e) {
            Log.d("ERROR", e.toString());
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        if (hasFocus && notTranslated){
            notTranslated = false;
            Log.d("Windows Focused", "Windows Focused");
            if (paragraphs!=null) {

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Log.d("In a new Thread", "In a new Thread");
                            JSONArray paragraphsParam = new JSONArray(paragraphs.values());

                            String parameters = null;
                            int numWords = preferredNumberOfWordsToTranslate();
                            try {
                                parameters = "texts=" + URLEncoder.encode(paragraphsParam.toString(), "UTF-8") + "&url="
                                                       + passedURL + "&name=" + NetworkUtils.user.name()
                                                       + "&num_words=" + numWords;
                            } catch (UnsupportedEncodingException e) {
                                e.printStackTrace();
                                Log.e("Encoding", "Failed");
                                return;
                            }

                            String translate_words = new PostRequest().execute(
                                    "http://wordnews-mobile.herokuapp.com/show_multiple/", parameters
                            ).get();

                            if (translate_words != null && !translate_words.equals("FAILED")) {

                                JSONArray wordsToTranslateForEachParagraph =
                                        new JSONArray(translate_words);

                                for (int i = 0; i < wordsToTranslateForEachParagraph.length(); i++) {
                                    JSONObject wordsToTranslate = wordsToTranslateForEachParagraph
                                            .getJSONObject(i);

                                    ArrayList<Word> words = new ArrayList<Word>();
                                    Iterator<String> keys = wordsToTranslate.keys();

                                    String paragraph = paragraphs.get(i);

                                    // Initial word
                                    words.add(Word.builder().paragraph(paragraph).paragraphID(i)
                                                  .build());

                                    while (keys.hasNext()) {
                                        String english = keys.next();
                                        JSONObject wordJson = new JSONObject(wordsToTranslate.getString(english));
                                        Log.d("TRANSLATE WORDS", english + wordJson.toString());
                                        Word word = Word.builder().english(english).chinese(wordJson.getString("chinese"))
                                                .wordID(wordJson.getString("wordID"))
                                                .passedUrl(passedURL)
                                                .testType(wordJson.getInt("isTest")).build();
                                        if (!word.isTest()) {
                                            word.setPronunciation(wordJson.getString("pronunciation").replace("\\n", ""));
                                            word.setPosition(wordJson.getInt("position"));
                                        } else {
                                            List<String> choices = new ArrayList<String>();
                                            JSONObject choicesJson = wordJson.getJSONObject("choices");
                                            Iterator x = choicesJson.keys();
                                            while (x.hasNext()) {
                                                choices.add((String) choicesJson.get((String) x.next()));
                                            }
                                            word.setChoices(choices);
                                        }
                                        words.add(word);
                                    }
                                    handler_.sendMessage(Message.obtain(handler_, UPDATE_UI, words));
                                }
                            }

                        } catch (ExecutionException | JSONException | InterruptedException e) {
                            Log.d("ERROR", e.toString());
                        }
                    }
                }).start();

            }
        }
    }

    private Handler handler_ = new Handler(){
        @Override
        public void handleMessage(Message msg){
        switch(msg.what){
            case UPDATE_UI:
                ArrayList<Word> words = (ArrayList<Word>)msg.obj;

                if (words.size() > 0) {
                    String paragraph = words.get(0).paragraph;
                    Integer paragraphID = words.get(0).paragraphID;

                    SpannableString ss = new SpannableString(paragraph);
                    TextView textView = (TextView)findViewById(paragraphID);

                    for (int i=1; i<words.size(); i++) {
                        final Word word = words.get(i);
                        ClickableSpan clickableSpan = new ClickableSpan() {
                            @Override
                            public void onClick(View view) {
                                ViewDialog alert = new ViewDialog();
                                TextView tmpView = (TextView) view;
                                String text_msg = word.chinese;
                                Spanned s = (Spanned) tmpView.getText();

                                int start = s.getSpanStart(this);
                                int end = s.getSpanEnd(this);

                                String text_title = s.subSequence(start, end).toString();
                                String urlParameters = "wordId=" + word.wordID + "&url=" + word.getPassedUrl() + "&name=" + NetworkUtils.user.name() + "&isRemembered=1";

                                try {
                                    new GetRequest().execute(NetworkUtils.REMEMBER_URL,urlParameters).get();
                                } catch (InterruptedException | ExecutionException e) {
                                    e.printStackTrace();
                                }
                                switch (word.getTestType()){
                                    //show translate & pronunciation
                                    case 0:
                                        alert.showDialog(TranslateBuildInActivity.this, text_title, text_msg, word);
                                        break;
                                    //show quiz (english)
                                    case 1:
                                        Intent intent = new Intent(TranslateBuildInActivity.this, QuizActivity.class);
                                        QuizModel quiz = new QuizModel(word.getChoices(),word.getEnglish(),word.getChinese(),"verb");
                                        Bundle mBundle = new Bundle();
                                        mBundle.putParcelable("quiz",quiz);
                                        intent.putExtras(mBundle);
                                        startActivity(intent);
                                        break;
                                    //show quiz (chinese)
                                    case 2:
                                        Bundle mBundleChinese = new Bundle();
                                        mBundleChinese.putParcelable("quiz",
                                                new QuizModel(word.getChoices(), word.getChinese(), word.getEnglish(), "verb"));
                                        Intent intentChinese =
                                                new Intent(TranslateBuildInActivity.this, QuizActivity.class).putExtras(mBundleChinese);
                                        startActivity(intentChinese);
                                        break;
                                }
                            }
                        };
                        int position = !word.isTest() ? word.position : paragraph.indexOf(word.english);

                        ss.setSpan(clickableSpan, position, position +  word.english.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    }
                    textView.setText(ss);
                    textView.setMovementMethod(LinkMovementMethod.getInstance());
                }
                break;
        }
        }
    };

    private int preferredNumberOfWordsToTranslate() {
        SharedPreferences appPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        return Integer.parseInt(appPreferences.getString("wordcount", "2"));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id) {
            case R.id.action_settings:
                startActivity(
                        new Intent(this, SettingActivity.class)
                );
                break;

            case R.id.action_learning_history:
                startActivity(
                        new Intent(this, WordsHistoryList.class)
                );
                break;

            case R.id.action_signin:
                startActivity(
                        new Intent(this, SignInActivity.class)
                );
                break;
            default:
                throw new RuntimeException("Invalid menu item selected");
        }

        return super.onOptionsItemSelected(item);
    }
}

