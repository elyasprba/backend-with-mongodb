import { NextFunction, Request, Response } from 'express';
import { registerUserService } from '../services/auth.service';
import { successResponse } from '../middleware/response';
import bcrypt from 'bcrypt';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username,
      email,
      password: hasedPassword,
    };

    const result = await registerUserService(payload);

    successResponse(res, 201, 'Register success', { result: result?._id });
  } catch (error) {
    next(error);
  }
};
