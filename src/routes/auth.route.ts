import expesss from 'express';
import {
  loginUserController,
  registerUserController,
  logoutUserController,
} from '../controllers/auth.controller';
import { checkDuplicateUser } from '../middleware/checkDuplicateUser';
import { checkToken } from '../middleware/access.token';

const router = expesss.Router();

router.post('/register', checkDuplicateUser, registerUserController);
router.post('/login', loginUserController);
router.post('/logout', checkToken, logoutUserController);

export default router;
