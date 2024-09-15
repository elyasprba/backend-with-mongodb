import express from 'express';
import {
  createPaymentController,
  getPaymentStatusController,
} from '../controllers/payment.controller';

const router = express.Router();

router.post('/', createPaymentController);
router.get('/status', getPaymentStatusController);

export default router;
