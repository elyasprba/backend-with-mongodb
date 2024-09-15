import expesss from 'express';

import authRouter from './auth.route';
import userRouter from './user.route';
import paymentRouter from './payment.route';
import publicRouter from './public.route';

const router = expesss.Router();

router.use(publicRouter);

router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/payment', paymentRouter);

export default router;
