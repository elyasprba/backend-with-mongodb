import expesss from 'express';
import {
  getUserController,
  getUsersByIdController,
  updateUserController,
} from '../controllers/user.controller';
import { checkToken } from '../middleware/access.token';

const router = expesss.Router();

router.get('/', checkToken, getUserController);
router.get('/:id', checkToken, getUsersByIdController);
router.put('/:id', checkToken, updateUserController);

export default router;
