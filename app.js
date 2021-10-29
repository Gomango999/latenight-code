const dotenv = require('dotenv')
const fs = require("fs")
const path = require("path")
const express = require("express");
const favicon = require('serve-favicon');

dotenv.config() // load from .env file

let indexRouter = require('./routes/index');
let blogRouter = require('./routes/blog');

const app = express();

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use("/", indexRouter);
app.use("/blog", blogRouter);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, function() { console.log(`Listening on port ${port}`);})
