import express from 'express';
import { index } from '../controllers/spinnerController.js';

let router = express.Router();

router.get('/', index);

export default router;
