import dotenv from 'dotenv';
import mongodb from 'mongodb';

// loads environment variables from the `.env` file and populates `process`
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    // TODO: Display this error on the site itself
    console.error("URI not found");
}

const mongoClient = new mongodb.MongoClient(uri);
const dbName = 'latenightcode'

export function index(_req, res) {
    mongoClient.connect()
        .then((client, err) => {
            if (err) console.error(err);

            const collection = client.db(dbName).collection('main');

            return collection.find({}).toArray().then( documents => {
                return [client, documents]
            });
        })
        .then(([client, documents], err) => {
            if (err) console.error(err);

            const document = documents[0];
            const visits = document.numSiteVisits;
            const currVisits = visits + 1;

            res.render('index.pug', {
                visits: currVisits 
            });

            const collection = client.db(dbName).collection('main');
            return collection.updateOne({}, { $set: { 'numSiteVisits': currVisits } });
        });
}
