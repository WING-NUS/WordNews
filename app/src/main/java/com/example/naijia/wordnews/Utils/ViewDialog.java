package com.example.naijia.wordnews.Utils;

import android.app.Activity;
import android.app.Dialog;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.models.Word;

import java.io.IOException;


public class ViewDialog {
    public void showDialog(final Activity myActivity, String title_msg, String text_msg, Word word){
        final Dialog dialog = new Dialog(myActivity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.test_dialog);
//        txt_help_gest = (TextView) dialog.findViewById(R.id.txt_help_gest);
//        txt_help_gest.setText("Example Sentence\n");
//        txt_help_gest.setVisibility(View.GONE);

        TextView message = (TextView) dialog.findViewById(R.id.text_dialog);
        message.setText(text_msg);
        message.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
//                txt_help_gest.setVisibility(txt_help_gest.isShown()
//                        ? View.GONE
//                        : View.VISIBLE);
                MediaPlayer mediaPlayer = MediaPlayer.create(myActivity, Uri.parse("http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/pin1.mp3"));
                mediaPlayer.start();
            }
        });

        TextView pinyin = (TextView) dialog.findViewById(R.id.text_pinyin);
        SpannableString ss = new SpannableString(word.pronunciation);
        String[] splitString = word.pronunciation.split("\\s+");

        int index = 0;
        for (int i=0;i<splitString.length;i++) {
            ClickableSpan clickableSpan = new ClickableSpan() {
                @Override
                public void onClick(View view) {
                    TextView tmpView = (TextView) view;
                    Spanned s = (Spanned) tmpView.getText();
                    int start = s.getSpanStart(this);
                    int end = s.getSpanEnd(this);
                    String pinyin = s.subSequence(start, end).toString();
                    String url = "http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/"+pinyin+".mp3";
                    MediaPlayer mediaPlayer = MediaPlayer.create(myActivity, Uri.parse(url));
                    mediaPlayer.start();
                }
            };
            Log.d("index and length", "" + index + " " + splitString[i].length() + " " + splitString[i]);
            ss.setSpan(clickableSpan, index, index + splitString[i].length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

            index += splitString[i].length() + 1;
        }

        pinyin.setText(ss);
        pinyin.setMovementMethod(LinkMovementMethod.getInstance());

        TextView title = (TextView) dialog.findViewById(R.id.title_dialog);
        title.setText(title_msg);

        dialog.show();


        }

}
