package thack.ac.wordnews;

import android.graphics.Typeface;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.text.Html;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.StyleSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by paradite on 21/9/14.
 */
public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    private static final int MAX_LENGTH_CONTENT = 200;
    private ArrayList<NewsItem> mDataset;
    OnItemClickListener mItemClickListener;

    //The term being queried, for highlighting purposes
    private static String queried_term;

    public static void setQueriedTerm(String queried_term) {
        MyAdapter.queried_term = queried_term;
    }

    // Provide a reference to the type of views that you are using
    // (custom viewholder)
    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        public CardView       mCardView;
        public TextView       mTextViewTitle;
        public TextView       mTextViewTime;
        public TextView       mTextViewSource;
        public ImageView      imgViewIcon;
        public RelativeLayout mCardViewWrapper;
        public ProgressBar    mProfileProgress;
        public ProgressBar    mPictureProgress;

        public ViewHolder(View v) {
            super(v);
            mCardView = (CardView) v.findViewById(R.id.card_view);
            mCardViewWrapper = (RelativeLayout) v.findViewById(R.id.card_wrapper);
            mTextViewTitle = (TextView) v.findViewById(R.id.item_title);
            mTextViewTime = (TextView) v.findViewById(R.id.item_time);
            mTextViewSource = (TextView) v.findViewById(R.id.item_source);
            imgViewIcon = (ImageView) v.findViewById(R.id.item_icon);
            mProfileProgress = (ProgressBar) v.findViewById(R.id.progressBarProfilePic);

            mTextViewTitle.setOnClickListener(this);
            v.setOnClickListener(this);
            mTextViewTitle.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View view) {
                    if (mItemClickListener != null) {
                        mItemClickListener.onItemClick(view, getAdapterPosition());
                    }
                    return false;
                }
            });
        }


        @Override
        public void onClick(View v) {
            //Log.d("View: ", v.toString());
            //Toast.makeText(v.getContext(), mTextViewTitle.getText() + " position = " + getPosition(), Toast.LENGTH_SHORT).show();
            if (mItemClickListener != null) {
                mItemClickListener.onItemClick(v, getAdapterPosition());
            }
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public MyAdapter(ArrayList<NewsItem> myDataset) {
        mDataset = myDataset;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public MyAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                   int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_layout, parent, false);
        // set the view's size, margins, paddings and layout parameters
        return new ViewHolder(v);

    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // - get element from your dataset at this position
        NewsItem item = mDataset.get(position);
        Log.e("onBindViewHolder:", " pos: " + position + ", profile: " + item.getProfileDrawable());
        // - replace the contents of the view with that element

        //Differentiate different sources
        //Reference: http://colour.charlottedann.com/ and http://stackoverflow.com/questions/15852122/hex-transparency-in-colors

        //Set username and source
        holder.mTextViewTitle.setText(item.getHeadline());

        //Set content
        String content = item.getHeadline();
        //Parse the html elements
        Spanned content_spanned = Html.fromHtml(content);
        //Get part of the string if too long
        if(content_spanned.length() > 200){
            content_spanned = (Spanned) TextUtils.concat(content_spanned.subSequence(0, MAX_LENGTH_CONTENT), "...\n(Click to read more)");
        }
        //Set the time
        holder.mTextViewTime.setText(item.getDisplayTime());
        holder.mTextViewSource.setText(String.format("| %1s", item.getSource()));

        //Set the profile pic
        //Assume image is loading, show default loading progress
        //If it does not have image, hide the view
        if(item.getPicture_url() == null || item.getPicture_url().isEmpty()){
            holder.imgViewIcon.setVisibility(View.GONE);
            holder.mProfileProgress.setVisibility(View.GONE);
        }else if(item.getProfileDrawable() != null){
            //Loaded image when ready
            holder.imgViewIcon.setImageDrawable(item.getProfileDrawable());
            holder.mProfileProgress.setVisibility(View.GONE);
            holder.imgViewIcon.setVisibility(View.VISIBLE);
        }

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size();
    }

    public void setOnItemClickListener(final OnItemClickListener mItemClickListener) {
        this.mItemClickListener = mItemClickListener;
    }

    //public void setmDataset(ArrayList<StatusItem> dataset){
    //    mDataset = dataset;
    //}

    public void add(NewsItem item, int position) {
        mDataset.add(position, item);
        notifyItemInserted(position);
    }

    public void remove(NewsItem item) {
        int position = mDataset.indexOf(item);
        mDataset.remove(position);
        notifyItemRemoved(position);
    }

    public void removeAt(int position) {
        mDataset.remove(position);
        notifyItemRemoved(position);
    }

}
