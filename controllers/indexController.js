import mongodb from 'mongodb';

// set up connection to MongoDB server
const uri = process.env.MONGODB_URI;
if (!uri) {
    // TODO: Display this error on the site itself
    console.error("URI not found");
}

const mongoClient = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const clientPromise = mongoClient.connect();

export function index(_req, res) {
    clientPromise
        .then((client, err) => {
            if (err) console.error(err);

            const collection = client.db("latenightcode").collection("main");
            return collection.find({}).toArray()
        })
        .then(([client, documents], err) => {
            if (err) console.error(err);

            const document = documents[0];
            const visits = document.numSiteVisits;
            const currVisits = visits + 1;

            res.render('index.pug', {
                visits: currVisits 
            });

            const collection = client.db("latenightcode").collection("main");
            return collection.updateOne({}, { $set: { "numSiteVisits": currVisits } });
        });
}
