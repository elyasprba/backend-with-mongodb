import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
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
