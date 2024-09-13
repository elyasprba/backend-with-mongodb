import { NextFunction, Request, Response } from 'express';
import {
  confirmUserService,
  loginUserService,
  logoutUserService,
  registerUserService,
} from '../services/auth.service';
import { errorResponse, successResponse } from '../middleware/response';

import bcrypt from 'bcrypt';
import { client } from '../config/redis';
import { CACHE_KEY_CONFIRM_EMAIL } from '../constants/cache.key';
import { getUserByEmail } from '../services/user.service';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;

    // call service register user and create data to database
    await registerUserService(body);

    return successResponse(
      res,
      201,
      'Register Success, Please Check your email for verification'
    );
  } catch (error) {
    return next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await loginUserService(email);

    if (!user) return errorResponse(res, 404, 'User not found');

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.result.password
    );

    if (!isPasswordMatch) return errorResponse(res, 400, 'Wrong Password');

    if (user?.result.active !== 'active') {
      return errorResponse(
        res,
        403,
        'Pending Account. Please Verify Your Email'
      );
    }

    res
      // .cookie('accessToken', user.accessToken, { httpOnly: true })
      .cookie('refreshToken', user.refreshToken, { httpOnly: true })
      .status(200)
      .json({
        message: 'Login success',
        data: {
          id: user.result._id,
          email: user.result.email,
          username: user.result.username,
          role: user.result.role,
        },
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });

    next();
  } catch (error) {
    return next(error);
  }
};

export const confirmUserController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cachedData = await client.get(CACHE_KEY_CONFIRM_EMAIL);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { email } = parsedData;

      const result = await getUserByEmail(email);

      if (result?.active === 'active') {
        await client.del(CACHE_KEY_CONFIRM_EMAIL);
        errorResponse(res, 403, 'User already active');
        return;
      }

      await confirmUserService(email);

      successResponse(res, 200, 'Confirm Success');
    }
  } catch (error) {
    return next(error);
  }
};

export const logoutUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    await logoutUserService(refreshToken);

    successResponse(res, 200, 'Logout success');
  } catch (error) {
    return next(error);
  }
};
