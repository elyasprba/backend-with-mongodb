import { NextFunction, Request, Response } from 'express';
import {
  loginUserService,
  logoutUserService,
  registerUserService,
} from '../services/auth.service';
import { errorResponse, successResponse } from '../middleware/response';

import bcrypt from 'bcrypt';
import { sendConfirmationEmail } from '../config/nodmailer';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;

    // call service register user and create data to database
    const result = await registerUserService(body);

    if (result && result.email) {
      await sendConfirmationEmail(result.username, result.email);

      return successResponse(
        res,
        201,
        'Register Success, Please Check your email for verification'
      );
    }

    return errorResponse(
      res,
      500,
      'Registration succeeded but failed to send confirmation email'
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
