const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.index = function (req, res) {
  client.connect(err => {
    if (err) throw err;

    const collection = client.db("latenightcode").collection("main");

    // find the main collection
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;

      // there should be only one document in the main collection, which stores
      // all the information about the latenight code server.
      result = result[0];
      const visits = result.numSiteVisits;

      // update the number of visits in the databse
      collection.updateOne({}, {$set:{"numSiteVisits":visits+1}}).then(() => {
        client.close();
      });

      // return the site for rendering
      res.render('index.pug', {
        visits: visits
      });

    });

  });

}
