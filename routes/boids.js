import express from 'express';
import { index } from '../controllers/boids.js';

let router = express.Router();

router.get('/', index);

export default router;
