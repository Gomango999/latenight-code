const fs = require("fs")
const path = require("path")
const express = require("express");

var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var writeupsRouter = require('./routes/writeups');
var artRouter = require('./routes/art');

const app = express();

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/writeups", writeupsRouter);
app.use("/art", artRouter);

app.listen(8080, function() {
	console.log("Listening on port 8080");
})
