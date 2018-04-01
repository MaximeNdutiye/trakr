package me.phum.trakr

import android.graphics.Color
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import kotlinx.android.synthetic.main.package_list_item.view.*
import me.phum.trakr.data.Pack

/**
 * Created by patri on 2018-03-31.
 */
class PackageAdapter(val dataset : List<Pack>) : RecyclerView.Adapter<PackageAdapter.ViewHolder>() {
    interface ItemClickListener {
        fun onItemSelect(pack: Pack)
    }
    var itemClickListener : ItemClickListener? = null

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        bindViewHolder(holder, dataset[position])
    }

    fun bindViewHolder(holder : ViewHolder, pack : Pack) {
        holder.itemView.setOnClickListener {
            itemClickListener?.onItemSelect(pack)
        }
        holder.imageTrackIcon.setColorFilter(Color.HSVToColor(arrayOf(pack.hue, 255f, 255f).toFloatArray()))
            holder.label.text = "${pack.name}"
            holder.eta.text = "Arriving: ${pack.getFormattedArrivalTime()}"
            holder.lastLocation.text = "Currently In ${pack.location.last().name}"
            holder.trackingId.text = "${pack.trackingId}"
        }

    override fun getItemCount() = dataset.size

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.package_list_item, parent, false)

        return ViewHolder(view)
    }

    class ViewHolder(itemView : View) : RecyclerView.ViewHolder(itemView) {
        val imageTrackIcon = itemView.img_track_color
        val label = itemView.label
        val eta = itemView.eta
        val lastLocation = itemView.last_location
        val trackingId = itemView.track_id
    }
}