package com.example.naijia.wordnews.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Created by 益多 on 1/26/2016.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizModel {
    private String question;
    private String question_trans;
    private List<String> options;
    private String answer;
    private String word;
    private String wordType;
}
