package com.example.naijia.wordnews.Utils;

import android.app.Activity;
import android.app.Dialog;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.example.naijia.wordnews.R;

import java.io.IOException;


public class ViewDialog {
    TextView txt_help_gest;

    public void showDialog(final Activity activity, String title_msg, String text_msg){
        final Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.test_dialog);
//        txt_help_gest = (TextView) dialog.findViewById(R.id.txt_help_gest);
//        txt_help_gest.setText("Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n" +
//                "Example Sentence\n");
//        txt_help_gest.setText("Example Sentnce");
//        txt_help_gest.setVisibility(View.GONE);

        TextView message = (TextView) dialog.findViewById(R.id.text_dialog);
        message.setText(text_msg);
        message.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
//                txt_help_gest.setVisibility(txt_help_gest.isShown()
//                        ? View.GONE
//                        : View.VISIBLE);
                MediaPlayer mediaPlayer = MediaPlayer.create(activity, Uri.parse("http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/pin1.mp3"));
                mediaPlayer.start();
            }
        });

        TextView pinyin = (TextView) dialog.findViewById(R.id.text_pinyin);
        pinyin.setText("pin yin");
        pinyin.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                MediaPlayer mediaPlayer = MediaPlayer.create(activity, Uri.parse("http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/pin1.mp3"));
                mediaPlayer.start();
            }
        });

        TextView title = (TextView) dialog.findViewById(R.id.title_dialog);
        title.setText(title_msg);

//        ImageButton clickButton = (ImageButton) dialog.findViewById(R.id.sound_btn);
//        clickButton.setOnClickListener(new View.OnClickListener() {
//               @Override
//               public void onClick(View v) {
//                   MediaPlayer mediaPlayer = MediaPlayer.create(activity, Uri.parse("http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/pin1.mp3"));
//                   mediaPlayer.start();
//               }
//        });

        dialog.show();


        }

}
