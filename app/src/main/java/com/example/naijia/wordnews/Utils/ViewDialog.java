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
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.example.naijia.wordnews.R;
import com.example.naijia.wordnews.models.Word;

import java.io.IOException;


public class ViewDialog {
    public void showDialog(final Activity myActivity, String title_msg, String text_msg, final Word word){
        final Dialog dialog = new Dialog(myActivity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.test_dialog);

        TextView message = (TextView) dialog.findViewById(R.id.text_dialog);
        message.setText(text_msg);

        ImageView image = (ImageView) dialog.findViewById(R.id.imageView1);
        image.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                MediaPlayer mediaPlayer;
                if(!word.pronunciation.equals("")) {
                    String[] splitString = word.pronunciation.split("\\s+");
                    for (int i=0;i<splitString.length;i++) {
                        String pinyin = splitString[i];
                        String url = NetworkUtils.pronunciationUrl(pinyin);
                        mediaPlayer = MediaPlayer.create(myActivity, Uri.parse(url));
                        mediaPlayer.start();
                    }
                }
            }
        });

        TextView pinyin = (TextView) dialog.findViewById(R.id.text_pinyin);
        SpannableString ss = new SpannableString(word.pronunciation);
//        String[] splitString = word.pronunciation.split("\\s+");
//        int index = 0;
//        for (int i=0;i<splitString.length;i++) {
//            ClickableSpan clickableSpan = new ClickableSpan() {
//                @Override
//                public void onClick(View view) {
//                    TextView tmpView = (TextView) view;
//                    Spanned s = (Spanned) tmpView.getText();
//                    int start = s.getSpanStart(this);
//                    int end = s.getSpanEnd(this);
//                    String pinyin = s.subSequence(start, end).toString();
//                    String url = "http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/"+pinyin+".mp3";
//                    MediaPlayer mediaPlayer = MediaPlayer.create(myActivity, Uri.parse(url));
//                    mediaPlayer.start();
//                }
//            };
//            Log.d("index and length", "" + index + " " + splitString[i].length() + " " + splitString[i]);
//            ss.setSpan(clickableSpan, index, index + splitString[i].length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
//
//            index += splitString[i].length() + 1;
//        }
//
//        LinearLayout linearLayout = new LinearLayout(myActivity);
//        ImageView myImage = new ImageView(myActivity);
//        myImage.setImageResource(R.drawable.audio512x512);
//        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
//                RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT,
//                Gravity.NO_GRAVITY);
//        myImage.setLayoutParams(params);
//        linearLayout.addView(myImage);

        pinyin.setText(word.pronunciation);
        pinyin.setMovementMethod(LinkMovementMethod.getInstance());

        TextView title = (TextView) dialog.findViewById(R.id.title_dialog);
        title.setText(title_msg);

        dialog.show();


        }

}
