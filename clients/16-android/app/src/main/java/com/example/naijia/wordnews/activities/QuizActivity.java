package com.example.naijia.wordnews.activities;

import android.app.ActionBar;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.Utils.ViewDialog;
import com.example.naijia.wordnews.models.QuizModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by 益多 on 1/25/2016.
 */
public class QuizActivity extends AppCompatActivity {
    private TextView questionView;
    private List<RadioButton> optionButtons = new ArrayList<RadioButton>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        getActionBar().setBackgroundDrawable(new ColorDrawable(Color.rgb(64, 224, 208)));
        setContentView(R.layout.quiz_main);
        getSupportActionBar().setIcon(R.drawable.sound);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        Intent intent = getIntent();
        QuizModel quiz = (QuizModel) intent.getParcelableExtra("quiz");
        getViews(quiz);
        mapIntentData(quiz);
    }

    private void getViews(QuizModel quiz){
        this.questionView = (TextView) findViewById(R.id.questionTextView);
        RadioButton option1 = (RadioButton) findViewById(R.id.option1);
        RadioButton option2 = (RadioButton) findViewById(R.id.option2);
        RadioButton option3 = (RadioButton) findViewById(R.id.option3);
        RadioButton option4 = (RadioButton) findViewById(R.id.option4);
        this.optionButtons.add(option1);
        this.optionButtons.add(option2);
        this.optionButtons.add(option3);
        this.optionButtons.add(option4);
        setHandlerForRaido(quiz);
    }

    private void mapIntentData(QuizModel quiz){
        for (int i=0;i<quiz.getOptions().size();i++){
                this.optionButtons.get(i).setText(quiz.getOptions().get(i));
        }
        this.optionButtons.get(3).setText(quiz.getAnswer());
        this.questionView.setText(quiz.getWord());
    }

    private void setHandlerForRaido(final QuizModel quiz){
        RadioGroup group=(RadioGroup) findViewById(R.id.radioGroup1);
        group.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                RadioButton option = (RadioButton) findViewById(checkedId);
                Dialog dialog = new Dialog(QuizActivity.this);
                dialog.setContentView(R.layout.quiz_dialog);
                dialog.setTitle("Quiz Result");
                Button okButton = (Button) dialog.findViewById(R.id.dialog_ok_button);
                TextView notification = (TextView) dialog.findViewById(R.id.dialog_textview);
                okButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        onBackPressed();
                    }
                });
                if(option.getText().equals(quiz.getAnswer())){
                    notification.setText("Congratulations! You are correct!");
                }else{
                    notification.setText("Sorry, you are wrong, the correct answer is '" + quiz.getAnswer()+"'");
                }
                dialog.show();
            }
        });
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
        onBackPressed();
        return super.onOptionsItemSelected(item);
    }
}
