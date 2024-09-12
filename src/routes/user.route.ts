import expesss from 'express';
import {
  getUserController,
  getUsersByIdController,
} from '../controllers/user.controller';
import { checkToken } from '../middleware/access.token';

const router = expesss.Router();

router.get('/', checkToken, getUserController);
router.get('/:id', getUsersByIdController);

export default router;
