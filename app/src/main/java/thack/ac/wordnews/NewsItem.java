package thack.ac.wordnews;

import android.graphics.drawable.Drawable;
import android.text.format.DateUtils;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by paradite on 23/9/14.
 */
public class NewsItem implements Comparable<NewsItem> {
    private String   content_pic_url;
    private Date     created_at;
    private String   location;
    private String   url;
    private String   picture_url;
    private Drawable profileDrawable;
    private Drawable contentDrawable;
    private String   source;
    private String   headline;

    public NewsItem(String headline, String url, Date created_at, String picture_url, String source) {
        this.headline = headline;
        this.url = url;
        this.created_at = created_at;
        this.picture_url = picture_url;
        //this.profileDrawable = LoadImageFromWebOperations(picture_url);
        //Leave the fetching of profile picture to the adapter to do
        this.source = source;
        this.content_pic_url = null;
    }

    public String getHeadline() {
        return headline;
    }

    public String getUrl() {
        return url;
    }

    public Drawable getContentDrawable() {
        return contentDrawable;
    }

    public void setContentDrawable(Drawable contentDrawable) {
        this.contentDrawable = contentDrawable;
    }

    public String getContent_pic_url() {
        return content_pic_url;
    }

    public String getSource() {
        return source;
    }

    public String getPicture_url() {
        return picture_url;
    }

    public Drawable getProfileDrawable() {
        return profileDrawable;
    }

    public void setProfileDrawable(Drawable profileDrawable) {
        this.profileDrawable = profileDrawable;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public CharSequence getDisplayTime(){
        //Format formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //return formatter.format(this.created_at);
        return DateUtils.getRelativeTimeSpanString(this.created_at.getTime());
    }

    public String getExactTime(){
        Format formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss ZZZ");
        return formatter.format(this.created_at);
        //return DateUtils.getRelativeTimeSpanString(this.created_at.getTime());
    }

    @Override
    public String toString() {
        return this.headline + " " + this.url;
    }

    @Override
    public int compareTo(NewsItem o) {
        return -getCreated_at().compareTo(o.getCreated_at());
    }
}
