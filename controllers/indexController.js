const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var clientPromise = mongoClient.connect();

exports.index = function (req, res) {
  // get the document
  var documentPromise = clientPromise
  .then((client, err) => {
    if (err) console.err(err);

    // retrieve site statistics
    const collection = client.db("latenightcode").collection("main");
    return collection.find({}).toArray()
  });

  // update the server and display the site
  Promise.all([clientPromise, documentPromise])
  .then(([client, documents], err) => {
    if (err) console.err(err);
    const document = documents[0];
    const visits = document.numSiteVisits;

    // render the site
    res.render('index.pug', {
      visits: visits+1
    });

    const collection = client.db("latenightcode").collection("main");
    return collection.updateOne({}, {$set:{"numSiteVisits":visits+1}});
  });
}
