import express from 'express';
import { index } from '../controllers/game-of-life.js';

let router = express.Router();

router.get('/', index);

export default router;
