import { UserModel } from '../models/users.model';
import { IUserPayloadRegister } from '../types/user.types';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import { sendConfirmationEmail } from '../config/nodmailer';
import { client } from '../config/redis';
import { CACHE_KEY_CONFIRM_EMAIL } from '../constants/cache.key';

export const registerUserService = async (payload: IUserPayloadRegister) => {
  try {
    const { username, email, password } = payload;

    const hasedPassword = await bcrypt.hash(password, 10);

    const body = {
      username,
      email,
      password: hasedPassword,
    };

    const result = await UserModel.create(body);

    const payloadToken = {
      id: result._id,
      email: result.email,
    };

    const accessTokenConfirm = jwt.sign(
      payloadToken,
      process.env.JWT_ACCESS_SECRET_CONFIRM as string,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME_CONFIRM }
    );

    await client.set(
      CACHE_KEY_CONFIRM_EMAIL,
      JSON.stringify({ email, accessTokenConfirm }),
      {
        EX: 300,
      }
    );

    await sendConfirmationEmail(username, email, accessTokenConfirm);

    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUserService = async (email: string) => {
  try {
    const result = await UserModel.findOne({ email });

    if (!result) {
      return null;
    }

    const payload = {
      id: result._id,
      email: result.email,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME }
    );

    await UserModel.updateOne(
      { _id: result._id },
      {
        $set: {
          refresh_token: refreshToken,
        },
      }
    );

    return { result, accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const confirmUserService = async (email: string) => {
  try {
    const result = await UserModel.updateOne(
      { email: email },
      {
        $set: {
          active: 'active',
        },
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const logoutUserService = async (refreshToken: string) => {
  try {
    const result = await UserModel.updateOne(
      { refresh_token: refreshToken },
      {
        $set: {
          refresh_token: '',
        },
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};
