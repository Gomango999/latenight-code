import express from 'express';
import { index, blogs } from '../controllers/blogController.js';

let router = express.Router();

router.get('/', index);

blogs.forEach(blog => {
    router.get(blog.url, blog.renderer);
});

export default router;
