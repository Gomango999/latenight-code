const fs = require("fs")
const path = require("path")
const express = require("express");

var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var writeupsRouter = require('./routes/writeups');
var artRouter = require('./routes/art');
var blogRouter = require('./routes/blog');

const app = express();

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/writeups", writeupsRouter);
app.use("/art", artRouter);
app.use("/blog", blogRouter);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, function() { console.log(`Listening on port ${port}`);})
