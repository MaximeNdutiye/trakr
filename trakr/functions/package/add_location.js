const MongoClient = require('mongodb').MongoClient;

let cache = null

/**
* @param {string} tracking_id
* @param {string} name
* @param {number} time
* @param {float} latitude
* @param {float} longitude
* @returns {any}
*/
module.exports = (tracking_id, name, time, latitude, longitude, context, callback) => {
    let uri = process.env['MONGO_KEY'];
    try {
        if (cache === null) {
            MongoClient.connect(uri, (error, db) => {
                if (error) {
                    console.log(error['errors']);
                    return callback(error);
                }
                console.log("Connection successful")
                cache = db.db("trakr")
                handler(tracking_id, name, time, latitude, longitude, cache, callback)
              });
        } else {
            handler(tracking_id, name, time, latitude, longitude, cache, callback)
        }
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}

const handler = (tracking_id, name, time, latitude, longitude, db, callback) => {

    const tracking_query = {
        tracking_id: tracking_id
    }

    db.collection("packages").findOne(tracking_query, (err, result) => {

        let locations = Object.assign([], result["locations"])
        locations.push({
            name: name,
            time: time,
            latitude: latitude,
            longitude: longitude
        })

        console.log(locations)

        const new_value = {
            $set: {
                locations: locations
            }
        }

        db.collection("packages").updateOne(tracking_query, new_value, (err, res) => {


            const new_package_value = result
            new_package_value.locations = locations

            if (err) {
                return callback(err)
            } else {
                return callback(null, JSON.stringify({data: new_package_value}))
            }

        })

    })
}
