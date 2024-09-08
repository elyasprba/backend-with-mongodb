import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// const client = createClient({
//   url: process.env.REDIS_URL,
// });

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  },
});

const connectRedis = async () => {
  try {
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    console.log('Redis connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectRedis, client };
