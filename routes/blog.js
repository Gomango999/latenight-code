import express from 'express';
import { index, posts } from '../controllers/blog.js';

let router = express.Router();

router.get('/', index);
router.get('/:post', posts);

export default router;
