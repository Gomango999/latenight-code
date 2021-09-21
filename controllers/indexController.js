// const MongoClient = require('mongodb');
//
// const uri = "mongodb+srv://Kevin:sRuKWKefdvXm5xvc@cluster0.etgc3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

exports.index = function (req, res) {
    res.render('index.pug');
}
