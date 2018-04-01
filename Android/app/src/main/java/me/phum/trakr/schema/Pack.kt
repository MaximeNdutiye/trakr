package me.phum.trakr.schema

import com.google.android.gms.maps.model.LatLng
import java.io.Serializable
import java.text.SimpleDateFormat
import java.util.*

/**
 * Created by patri on 2018-03-31.
 */
data class Pack(
        var trackingId : String,
        var location : List<Loc>,
        var estimatedTimeOfArrival : Long,
        var carrierName : String,
        var note : String,
        var hue : Float
) : Serializable {
    fun getFormattedArrivalTime() : String {
        return SimpleDateFormat("MMMM dd, yyyy").format(Date(estimatedTimeOfArrival))
    }
    val lastKnownLocation = location.last()

}
