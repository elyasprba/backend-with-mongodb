import expesss from 'express';
import { registerUserController } from '../controllers/auth.controller';
import { checkDuplicateUser } from '../middleware/checkDuplicateUser';

const router = expesss.Router();

router.post('/register', checkDuplicateUser, registerUserController);

export default router;
