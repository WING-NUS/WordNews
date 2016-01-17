package com.example.naijia.wordnews;

import android.app.Activity;
import android.app.Dialog;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

/**
 * Created by lzznj on 2016/1/17.
 */
public class ViewDialog {

    public void showDialog(Activity activity, String title_msg, String text_msg){
        final Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.test_dialog);

        TextView message = (TextView) dialog.findViewById(R.id.text_dialog);
        message.setText(text_msg);
        TextView title = (TextView) dialog.findViewById(R.id.title_dialog);
        title.setText(title_msg);

//        Button dialogButton = (Button) dialog.findViewById(R.id.btn_dialog);
//        dialogButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                dialog.dismiss();
//            }
//        });

        dialog.show();

    }
}
