const MongoClient = require('mongodb').MongoClient;
const Faker = require('faker')
const ObjectId = require('mongodb').ObjectID

const seed_data = [
    {
        tracking_id: "111",
        carrier_name: "Canada Post",
        note: "Leave at door step",
    },
    {
        tracking_id: "112",
        carrier_name: "Amazon",
        note: "Deliver before 5 pm",
    },
    {
        tracking_id: "113",
        carrier_name: "UPS",
        note: "N/A",
    },
    {
        tracking_id: "114",
        carrier_name: "FedEx",
        note: "N/A",
    },
    {
        tracking_id: "115",
        carrier_name: "Amazon",
        note: "Fragil",
    }
]

const seed_location_data = {
    "111": [
        {
            name: "Toronto",
            time: Faker.date.past(0),
            latitude: 45.4187698,
            longitude: -75.6917538,
        },
        {
            name: "Ottawa",
            time: Faker.date.past(0),
            latitude: 50.733797,
            longitude: -83.181364
        }
    ],
    "112": [
        {
            name: "Waterloo",
            time: Faker.date.past(0),
            latitude: 42.674930,
            longitude: -73.870623
        },
        {
            name: "Kingston",
            time: Faker.date.past(0),
            latitude: 34.634091,
            longitude: -117.726935
        },
        {
            name: "Kitchener",
            time: Faker.date.past(0),
            latitude: 45.117508,
            longitude: -117.732857
        }
    ],
    "113": [
        {
            name: "Kitchener",
            time: Faker.date.past(0),
            latitude: 27.092760,
            longitude: -81.510807
        }
    ],
    "114": [],
    "115": [],
}

const uri = "mongodb://root:foobar@cluster0-shard-00-00-921yu.mongodb.net:27017,cluster0-shard-00-01-921yu.mongodb.net:27017,cluster0-shard-00-02-921yu.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

MongoClient.connect(uri, (err, db) => {
    const connection = db.db("trakr")

    const populated = seed_data.map((data) => {
        data["_id"] = ObjectId.createPk()
        data["locations"] = seed_location_data[data.tracking_id]
        data["estimate_time_arrival"] = Faker.date.future(0)
        return data
    })

    connection.collection("packages").insertMany(populated)

})

