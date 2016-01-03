package com.example.naijia.wordnews;

import android.util.Log;
import android.widget.ListView;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.IOException;
import java.io.StringReader;
import java.util.concurrent.ExecutionException;

/**
 * Created by lzznj on 2016/1/3.
 */
public class IndexListViewUpdate {

    public void updateData(PostData[] listData){
        try{
            String url = "http://www.forbes.com/most-popular/feed/";
            //String xmlRecords = "<data><terminal_id>1000099999</terminal_id><merchant_id>10004444</merchant_id><merchant_info>Mc Donald's - Abdoun</merchant_info></data>";
            String response = "";
            try {
                response = new APIRequest().execute(url).get();
            } catch (ExecutionException | InterruptedException e) {
                //DO something
            }

            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            XmlPullParser xpp = factory.newPullParser();
            xpp.setInput(new StringReader(response));
            int eventType = xpp.getEventType();
            PostData data = null;
            int count = 0;
            data = new PostData();
            data.postDate = "";
            data.postTitle = "";
            data.postLink = "";
            data.postThumbUrl = null;
            String nameTag = "";
            while (eventType != XmlPullParser.END_DOCUMENT) {

                if (eventType == XmlPullParser.START_DOCUMENT) {
                    //do something
                } else if (eventType == XmlPullParser.START_TAG) {
                    if (nameTag.equals("media:content") | nameTag.equals("media:thumbnail")){
//                        Log.d("LOG_TEXT",xpp.getText()+" "+xpp.getText().length());
//                        Log.d("LOG_TEXT",xpp.getText()+" "+xpp.getAttributeName(0)+" "+xpp.getAttributeNamespace(0));
                        if(xpp.getAttributeValue(null,"url") != null){
//                            Log.d("LOG_TEXT",xpp.getAttributeValue(null,"url"));
                            data.postThumbUrl = xpp.getAttributeValue(null, "url");
                        }
                    }
                    nameTag = xpp.getName();
                } else if (eventType == XmlPullParser.END_TAG) {
                    if(xpp.getName().equals("item")) {
                        Log.d("LOG",data.postTitle+"|"+data.postThumbUrl);
                        listData[count] = data;
                        count++;
                        if(count>=20) break;
                        data = new PostData();
                        data.postDate = "";
                        data.postTitle = "";
                        data.postLink = "";
                        data.postThumbUrl = null;
                    }
                } else if (eventType == XmlPullParser.TEXT) {
//                    Log.d("LOG_TAG",nameTag);
                    if(nameTag.equals("title") && xpp.getText().length() > 6){
                        data.postTitle = xpp.getText();
                    } else if (nameTag.equals("pubDate") && xpp.getText().length() > 6){
                        data.postDate = xpp.getText();
                    } else if (nameTag.equals("link") && xpp.getText().length() > 6){
                        data.postLink = xpp.getText();
                    }
                } else {
                    Log.d("LOG_UNKNOWN_DATA","LOG_UNKNOWN_DATA");
                    Log.d("LOG_UNKNOWN_DATA",xpp.getText());
                }
                eventType = xpp.next();
            }
            for(int i=0;i<10;i++){
                Log.d("LOG_FINAL", listData[i].postTitle);
            }
        } catch (IOException | XmlPullParserException e){
            this.generateDummyData(listData);
        }
    }
    private void generateDummyData(PostData[] listData) {
        PostData data = null;
        listData = new PostData[10];
        for (int i = 0; i < 10; i++) { //please ignore this comment :>
            data = new PostData();
            data.postDate = "May 20, 2013";
            data.postTitle = "Post " + (i + 1) + " Title: This is the Post Title from RSS Feed";
            data.postThumbUrl = null;
            listData[i] = data;
        }
    }
}
