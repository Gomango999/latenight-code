import express from 'express';
import { index } from '../controllers/indexController.js';

let router = express.Router();

router.get('/', index);

export default router;
