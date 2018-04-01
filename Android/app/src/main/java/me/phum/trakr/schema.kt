package me.phum.trakr

/**
 * Created by patri on 2018-03-31.
 */
data class SchemaLoc(
    val name : String,
    val time : Long,
    val latitude : Double,
    val longitude : Double
)

data class SchemaPack(
    val tracking_id : String,
    val display_name : String,
    val locations : Array<SchemaLoc>,
    val _estimate_time_arrival : Long,
    val carrier_name : String,
    val note : String
)

data class SchemaResponse (
    val data : List<SchemaPack>
)