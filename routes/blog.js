import express from 'express';
import { index, posts } from '../controllers/blogController.js';

let router = express.Router();

router.get('/', index);
router.get('/:post', posts);

export default router;
