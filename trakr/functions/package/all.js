const MongoClient = require('mongodb').MongoClient;

let cache = null

/**
* @returns {any}
*/
module.exports = (context, callback) => {
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
                handler(cache, callback)
              });
        } else {
            handler(cache, callback)
        }
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}

const handler = (db, callback) => {
    db.collection('packages').find({}, {}).toArray((err, result) => {
        return callback(null, result)
    })
}

