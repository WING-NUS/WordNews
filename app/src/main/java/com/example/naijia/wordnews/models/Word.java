package com.example.naijia.wordnews.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

@Builder
@NoArgsConstructor
@AllArgsConstructor(suppressConstructorProperties = true)
@Data
public class Word {
    public String english;
    public String chinese;
    public String wordID;
    public Integer position;
    public String pronunciation;
    public String chineseSentence;
    public String englishSentence;
    public Integer testType;
    public String paragraph;
    public Integer paragraphID;
    private List<String> choices;
    private String passedUrl;
}
