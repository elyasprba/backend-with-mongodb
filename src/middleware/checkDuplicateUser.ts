import { NextFunction, Request, Response } from 'express';
import { errorResponse } from './response';

import { UserModel } from '../models/users.model';

export const checkDuplicateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const result = await UserModel.find({ email });

    if (result.length > 0) {
      errorResponse(res, 409, 'Email already exists');
      return;
    }

    next();
  } catch (error) {
    throw error;
  }
};
