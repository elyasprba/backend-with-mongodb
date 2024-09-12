import expesss from 'express';
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  confirmUserController,
} from '../controllers/auth.controller';
import { checkDuplicateUser } from '../middleware/checkDuplicateUser';
import { userRegistrationSchema, validateData } from '../middleware/validate';
import { checkTokenEmailConfirm } from '../middleware/access.token';

const router = expesss.Router();

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
