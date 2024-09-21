import express from 'express';
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  confirmUserController,
} from '../controllers/auth.controller';
import { checkDuplicateUser } from '../middleware/checkDuplicateUser';
import { validateData } from '../validation/validate';
import { checkTokenEmailConfirm } from '../middleware/access.token';
import { userRegistrationSchema } from '../validation/register.schema';

const router = express.Router();

router.post(
  '/register',
  validateData(userRegistrationSchema),
  checkDuplicateUser,
  registerUserController
);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.get('/confirm/:token', checkTokenEmailConfirm, confirmUserController);

export default router;
