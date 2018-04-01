const MongoClient = require('mongodb').MongoClient;
const Faker = require('faker')
const ObjectId = require('mongodb').ObjectID

let cache = null;

const genPastDate = () => {
    return Date.parse(Faker.date.past(0))
}

/**
* @param {string} tracking_id
* @param {string} carrier_name
* @param {string} note
* @param {string} display_name
* @returns {any}
*/
module.exports = (tracking_id, carrier_name, note, display_name, context, callback) => {
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
                handler(tracking_id, carrier_name, note, display_name, cache, callback)
              });
        } else {
            handler(tracking_id, carrier_name, note, display_name, cache, callback)
        }
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}


const handler = (tracking_id, carrier_name, note, display_name, db, callback) => {
    const new_package = {
        _id: ObjectId.createPk(),
        tracking_id: tracking_id,
        display_name: display_name,
        locations: [],
        estimate_time_arrival: Faker.date.future(0),
        _estimate_time_arrival: genPastDate(),
        carrier_name: carrier_name,
        note: note,
    }

    console.log('[INFO] Inserting:')
    console.log(new_package)

    db.collection('packages').insertOne(new_package, (err, res) => {
        return callback(null, JSON.stringify({data: new_package}))
    })
}
