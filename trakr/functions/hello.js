const MongoClient = require('mongodb').MongoClient;

/**
* @returns {any}
*/
module.exports = (context, callback) => {
    let uri = process.env['MONGO_KEY'];
    try {
      MongoClient.connect(uri, (error, db) => {
          if (error) {
            console.log(error['errors']);
            return callback(error);
          }
          console.log("Connection successful")
        });
        return callback(null, "connection sucessful")
    } catch (error) {
        console.log(error);
        return callback(error);
    }
};
