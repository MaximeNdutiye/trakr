const MongoClient = require('mongodb').MongoClient;
const Faker = require('faker')
const ObjectId = require('mongodb').ObjectID

const genPastDate = () => {
    return Date.parse(Faker.date.past(0))
}

const seed_data = [
    {
        tracking_id: "111",
        display_name: "XPS 15 2018 i7/8G",
        carrier_name: "Canada Post",
        note: "Leave at door step",
    },
    {
        tracking_id: "112",
        display_name: "iPhone 8 64G LTE GSM Unlocked",
        carrier_name: "Amazon",
        note: "Deliver before 5 pm",
    },
    {
        tracking_id: "113",
        display_name: "GAP Man Sweater LG",
        carrier_name: "UPS",
        note: "N/A",
    },
    {
        tracking_id: "114",
        display_name: "Nike Man Sneaker Size 12",
        carrier_name: "FedEx",
        note: "N/A",
    },
    {
        tracking_id: "115",
        display_name: "VISA $50 Gift card",
        carrier_name: "Amazon",
        note: "Fragil",
    }
]

const seed_location_data = {
    "111": [
        {
            name: "Toronto",
            time: genPastDate(),
            latitude: 45.4187698,
            longitude: -75.6917538,
        },
        {
            name: "Ottawa",
            time: genPastDate(),
            latitude: 50.733797,
            longitude: -83.181364
        }
    ],
    "112": [
        {
            name: "Waterloo",
            time: genPastDate(),
            latitude: 42.674930,
            longitude: -73.870623
        },
        {
            name: "Kingston",
            time: genPastDate(),
            latitude: 34.634091,
            longitude: -117.726935
        },
        {
            name: "Kitchener",
            time: genPastDate(),
            latitude: 45.117508,
            longitude: -117.732857
        }
    ],
    "113": [
        {
            name: "Kitchener",
            time: genPastDate(),
            latitude: 27.092760,
            longitude: -81.510807
        }
    ],
    "114": [
        {
            name: "Ottawa",
            time: genPastDate(),
            latitude: 45.454642,
            longitude: -75.759026
        }
    ],
    "115": [
        {
            name: "Toronto",
            time: genPastDate(),
            latitude: 43.564589,
            longitude: -79.596258
        }
    ],
}

const uri = "mongodb://root:foobar@cluster0-shard-00-00-921yu.mongodb.net:27017,cluster0-shard-00-01-921yu.mongodb.net:27017,cluster0-shard-00-02-921yu.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

MongoClient.connect(uri, (err, db) => {
    const connection = db.db("trakr")

    const populated = seed_data.map((data) => {
        data["_id"] = ObjectId.createPk()
        data["locations"] = seed_location_data[data.tracking_id]
        data["estimate_time_arrival"] = Faker.date.future(0)
        data["_estimate_time_arrival"] = genPastDate()
        return data
    })

    connection.collection("packages").insertMany(populated)

})

