import expesss from 'express';
import {
  loginUserController,
  registerUserController,
  logoutUserController,
} from '../controllers/auth.controller';
import { checkDuplicateUser } from '../middleware/checkDuplicateUser';
import { checkToken } from '../middleware/access.token';
import { userRegistrationSchema, validateData } from '../middleware/validate';

const router = expesss.Router();

router.post(
  '/register',
  validateData(userRegistrationSchema),
  checkDuplicateUser,
  registerUserController
);
router.post('/login', loginUserController);
router.post('/logout', checkToken, logoutUserController);

export default router;
