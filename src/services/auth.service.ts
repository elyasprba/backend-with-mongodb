import { UserModel } from '../models/users.model';
import { IUserPayloadRegister } from '../types/user.types';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

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
