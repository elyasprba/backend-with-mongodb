import express from 'express';
import {
  createPaymentController,
  getPaymentStatusController,
} from '../controllers/payment.controller';

const router = express.Router();

router.post('/payment', createPaymentController);
router.get('/payment/status', getPaymentStatusController);

export default router;
