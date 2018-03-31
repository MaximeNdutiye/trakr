package me.phum.trakr.schema

import java.io.Serializable

/**
 * Created by patri on 2018-03-31.
 */
data class Pack(
        var trackingId : String,
        var location : ArrayList<Loc>,
        var estimatedTimeOfArrival : Long,
        var carrierName : String,
        var note : String
) : Serializable