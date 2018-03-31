const MongoClient = require('mongodb').MongoClient;
const Faker = require('faker')
const ObjectId = require('mongodb').ObjectID

let cache = null;

/**
* @param {string} tracking_id
* @param {string} carrier_name
* @param {string} note
* @returns {any}
*/
module.exports = (tracking_id, carrier_name, note, context, callback) => {
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
                handler(tracking_id, carrier_name, note, cache, callback)
              });
        } else {
            handler(tracking_id, carrier_name, note, cache, callback)
        }
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}


const handler = (tracking_id, carrier_name, note, db, callback) => {
    const new_package = {
        _id: ObjectId.createPk(),
        tracking_id: tracking_id,
        locations: [],
        estimate_time_arrival: Faker.date.future(0),
        carrier_name: carrier_name,
        note: note,
    }

    console.log('[INFO] Inserting:')
    console.log(new_package)

    db.collection('packages').insertOne(new_package)

    return callback(null, JSON.stringify(new_package))
}
