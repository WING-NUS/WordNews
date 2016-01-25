package com.example.naijia.wordnews.Utils;

import android.app.Activity;
import android.app.Dialog;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import com.example.naijia.wordnews.R;


public class ViewDialog {
    TextView txt_help_gest;

    public void showDialog(Activity activity, String title_msg, String text_msg){
        final Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.test_dialog);
        txt_help_gest = (TextView) dialog.findViewById(R.id.txt_help_gest);
        txt_help_gest.setText("Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n" +
                "Example Sentence\n");
        txt_help_gest.setVisibility(View.GONE);

        TextView message = (TextView) dialog.findViewById(R.id.text_dialog);
        message.setText(text_msg);
        message.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                txt_help_gest.setVisibility(txt_help_gest.isShown()
                        ? View.GONE
                        : View.VISIBLE);
            }
        });
        TextView title = (TextView) dialog.findViewById(R.id.title_dialog);
        title.setText(title_msg);

        dialog.show();


    }

}
