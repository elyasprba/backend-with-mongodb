import express from 'express';

import { createProductContoller } from '../controllers/product.contoller';

const router = express.Router();

router.post('/', createProductContoller);

export default router;
