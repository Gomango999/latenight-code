import express from 'express';
import { index } from '../controllers/spinnerController';

let router = express.Router();

router.get('/', index);

export default router;
