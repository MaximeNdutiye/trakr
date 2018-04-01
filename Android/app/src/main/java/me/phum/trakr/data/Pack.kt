package me.phum.trakr.data

import java.io.Serializable
import java.text.SimpleDateFormat
import java.util.*

/**
 * Created by patri on 2018-03-31.
 */
data class Pack(
        var name : String,
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
