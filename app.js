import path from "path";
import express from "express";
import favicon from 'serve-favicon';

import indexRouter from './routes/index';
import blogRouter from './routes/blog';
import spinnerRouter from './routes/spinner';


let app = express();

app.set("view engine", "pug")
const viewsDir = path.join(__dirname, "views")
app.set("views", viewsDir)

// provides access for all routes to everything in the public folder
const publicDir = path.join(__dirname, 'public') 
app.use(express.static(publicDir));

const faviconPath = path.join(__dirname, 'public', 'images', 'favicon.ico');
app.use(favicon(faviconPath));

app.use("/", indexRouter);
app.use("/blog", blogRouter);
app.use("/spinner", spinnerRouter);
    
const port = 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
