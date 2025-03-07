import dotenv from 'dotenv';
import express from "express";
import favicon from 'serve-favicon';
import path from "path";
import url from 'url';

import indexRouter from './routes/index.js';
import blogRouter from './routes/blog.js';
import spinnerRouter from './routes/spinner.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
