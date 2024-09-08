import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import baserouter from './routes';

dotenv.config();

const server = express();

const PORT = process.env.PORT;

const corsOptions = {
  origin: ['*'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = async () => {
  try {
    // connect to db
    mongoose
      .connect(process.env.MONGO_URI as string)
      .then(() => console.log('Databse connection successful'))
      .catch((error) => {
        console.log('Database connection failed');
        console.log(error);
      });

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
