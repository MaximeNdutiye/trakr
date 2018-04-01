const MongoClient = require('mongodb').MongoClient;

let cache = null

/**
* @param {string} tracking_id
* @returns {any}
*/
module.exports = (tracking_id, context, callback) => {
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
                handler(tracking_id, cache, callback)
              });
        } else {
            handler(tracking_id, cache, callback)
        }
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}

const handler = (tracking_id, db, callback) => {

    const package_query = {
        tracking_id: tracking_id
    }

    db.collection('packages').remove(package_query, (err, result) => {
        if (err) {
            return callback(err)
        } else {
            return callback(null, JSON.stringify(result))
        }
    })
}
