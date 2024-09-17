import expesss from 'express';

import authRouter from './auth.route';
import userRouter from './user.route';
import paymentRouter from './payment.route';
import productRouter from './product.route';
import publicRouter from './public.route';

const router = expesss.Router();

router.use(publicRouter);

router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/payment', paymentRouter);
router.use('/api/product', productRouter);

export default router;
