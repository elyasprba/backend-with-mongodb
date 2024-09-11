import { NextFunction, Request, Response } from 'express';
import {
  loginUserService,
  logoutUserService,
  registerUserService,
} from '../services/auth.service';
import { errorResponse, successResponse } from '../middleware/response';

import bcrypt from 'bcrypt';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;

    const result = await registerUserService(body);

    successResponse(res, 201, 'Register success', { id: result._id });
  } catch (error) {
    next(error);
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

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.result.password
    );

    if (!isPasswordMatch) {
      return errorResponse(res, 400, 'Wrong password');
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
    next(error);
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
    next(error);
  }
};
