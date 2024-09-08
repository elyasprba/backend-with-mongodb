import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import baserouter from './routes';
import { connectRedis } from './config/redis';
import connectDB from './config/db';

dotenv.config();

const server = express();

const PORT = process.env.PORT;

const app = async () => {
  try {
    // connect to db
    connectDB();

    // connect to redis
    connectRedis();

    const corsOptions = {
      origin: ['*'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    server.use(
      morgan(':method :url :status :res[content-length] - :response-time ms')
    );

    server.use(cors(corsOptions));
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());

    server.use(baserouter);

    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

app();
