import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import baserouter from './routes';
import { connectRedis } from './config/redis';
import connectDB from './config/db';
import { cronSchedule } from './middleware/cron.schedule';

dotenv.config();

const server = express();

const PORT = process.env.PORT;

const app = async () => {
  try {
    // connect to db
    await connectDB();

    // connect to redis
    await connectRedis();

    // cron job run when server local running
    cronSchedule();

    const corsOptions = {
      origin: ['*'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    server.use(
      morgan(':method :url :status :res[content-length] - :response-time ms')
    );

    server.use(cookieParser());

    server.use(cors(corsOptions));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    server.use(baserouter);

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
};

app();
