package me.phum.trakr.schema

import com.google.android.gms.maps.model.LatLng
import java.io.Serializable

/**
 * Created by patri on 2018-03-31.
 */
data class Loc(
        var name : String,
        var time : Long,
        var latitude : Double,
        var longitude : Double
) : Serializable {
    fun getLatLng() : LatLng {
        return LatLng(latitude, longitude)
    }
}