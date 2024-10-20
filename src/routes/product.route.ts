import express from 'express';

import {
  createProductController,
  getAllProductController,
  getProductByIdController,
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
router.get('/:id', getProductByIdController);

export default router;
