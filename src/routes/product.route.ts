import express from 'express';

import { createProductContoller } from '../controllers/product.contoller';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/', upload, createProductContoller);

export default router;
