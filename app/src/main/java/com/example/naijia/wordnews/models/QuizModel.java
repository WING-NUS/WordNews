package com.example.naijia.wordnews.models;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Created by 益多 on 1/26/2016.
 */
@Data
@AllArgsConstructor(suppressConstructorProperties = true)
@NoArgsConstructor
public class QuizModel implements Parcelable {
    private String question;
    private String question_trans;
    private List<String> options;
    private String answer;
    private String word;
    private String wordType;

    public static final Creator<QuizModel> CREATOR = new Creator<QuizModel>() {
        public QuizModel createFromParcel(Parcel in) { return new QuizModel(in);}

        public QuizModel[] newArray(int size) { return new QuizModel[size]; }
    };

    public QuizModel(Parcel parcel) {
        this.options = new ArrayList<String>();
        this.question = parcel.readString();
        this.question_trans = parcel.readString();
        parcel.readStringList(this.options);
        this.answer = parcel.readString();
        this.word = parcel.readString();
        this.wordType = parcel.readString();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(question);
        dest.writeString(question_trans);
        dest.writeStringList(options);
        dest.writeString(answer);
        dest.writeString(word);
        dest.writeString(wordType);;
    }
}
