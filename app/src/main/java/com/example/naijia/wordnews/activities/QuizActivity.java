package com.example.naijia.wordnews.activities;

import android.app.ActionBar;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.models.QuizModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by 益多 on 1/25/2016.
 */
public class QuizActivity extends AppCompatActivity {
    private SharedPreferences savedValues;
    private TextView questionView;
    private TextView questionTransView;
    private List<RadioButton> optionButtons = new ArrayList<RadioButton>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.quiz_main);
        getSupportActionBar().setIcon(R.drawable.sound);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        getViews();
        Intent intent = getIntent();
        QuizModel quiz = (QuizModel) intent.getParcelableExtra("quiz");

        mapIntentData(quiz);
    }

    private void getViews(){
        this.questionView = (TextView) findViewById(R.id.questionTextView);
        this.questionTransView = (TextView) findViewById(R.id.questionTextViewTrans);
        RadioButton option1 = (RadioButton) findViewById(R.id.option1);
        RadioButton option2 = (RadioButton) findViewById(R.id.option2);
        RadioButton option3 = (RadioButton) findViewById(R.id.option3);
        RadioButton option4 = (RadioButton) findViewById(R.id.option4);
        this.optionButtons.add(option1);
        this.optionButtons.add(option2);
        this.optionButtons.add(option3);
        this.optionButtons.add(option4);
    }

    private void mapIntentData(QuizModel quiz){
        for (int i=0;i<quiz.getOptions().size();i++){
            this.optionButtons.get(i).setText(quiz.getOptions().get(i));
        }
        this.questionView.setText(quiz.getQuestion());
        this.questionTransView.setText(quiz.getQuestion_trans());
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu){
        menu.findItem(R.id.quiz_sound).setVisible(true);
        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.quiz_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.home) {
            this.finish();
        }
        return super.onOptionsItemSelected(item);
    }


}
