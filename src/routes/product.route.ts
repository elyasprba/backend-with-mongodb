import express from 'express';

import {
  createProductContoller,
  getAllProductController,
} from '../controllers/product.contoller';
import upload from '../middleware/upload';
import { checkToken } from '../middleware/access.token';

const router = express.Router();

router.post('/', checkToken, upload, createProductContoller);
router.get('/', checkToken, getAllProductController);

export default router;
