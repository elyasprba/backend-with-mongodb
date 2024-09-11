import expesss from 'express';
import { client } from '../config/redis';

import authRouter from './auth.route';

const router = expesss.Router();

router.get('/ping', (_req, res) => {
  res
    .json({
      message: 'pong',
    })
    .status(200);
});

router.get('/', (_req, res) => {
  res
    .json({
      message: 'Welcome to Learn MongoDB',
    })
    .status(200);
});

router.get('/cache', async (_req, res) => {
  try {
    const cachedData = await client.get('data');

    if (cachedData) {
      return res.json({
        message: 'Data dari cache',
        data: JSON.parse(cachedData),
      });
    }

    // Simulasi fetch data baru
    const freshData = { name: 'el', age: 23, city: 'Tangerang' };
    await client.set('data', JSON.stringify(freshData), { EX: 20 }); // Expire dalam 20 detik

    res.json({
      message: 'Data baru',
      data: freshData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
});

router.use('/api/auth', authRouter);

export default router;
