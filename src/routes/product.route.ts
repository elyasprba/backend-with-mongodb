import express from 'express';

import {
  createProductController,
  getAllProductController,
} from '../controllers/product.contoller';
import upload from '../middleware/upload';
import { checkToken } from '../middleware/access.token';
import { validateData } from '../validation/validate';
import { productSchema } from '../validation/product.schema';

const router = express.Router();

router.post(
  '/',
  checkToken,
  upload,
  validateData(productSchema),
  createProductController
);
router.get('/', checkToken, getAllProductController);

export default router;
