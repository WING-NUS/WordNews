package com.example.naijia.wordnews.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.widget.Button;
import android.widget.TextView;

import com.example.naijia.wordnews.R;

import java.util.ArrayList;

/**
 * Created by 益多 on 1/25/2016.
 */
public class QuizActivity extends AppCompatActivity {
    private SharedPreferences savedValues;
    private TextView questionView;
    private ArrayList<String> answersArray;
    private ArrayList<Button> answersButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.quiz_main);
        questionView = (TextView) findViewById(R.id.questionTextView);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }


}
