import expesss from 'express';

const router = expesss.Router();

router.get('/ping', (_req, res) => {
  res
    .json({
      message: 'pong',
    })
    .status(200);
});

export default router;
