const fs = require("fs")
const path = require("path")
const express = require("express");
const app = express();

// app.set("view engine", "pug")
// app.set("views", path.join(__dirname, "views"))

// app.get("art", function(req, res) {
// 	res.render('')
// })

app.use(express.static("."));

app.listen(8080, function() {
	console.log("Listening on port 8080");
})
	
