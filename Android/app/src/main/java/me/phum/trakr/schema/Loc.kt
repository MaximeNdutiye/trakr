package me.phum.trakr.schema

import java.io.Serializable

/**
 * Created by patri on 2018-03-31.
 */
data class Loc(
        var time : Long,
        var location : String,
        var latitude : String,
        var longitude : String
) : Serializable