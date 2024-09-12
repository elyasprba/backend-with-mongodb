import { NextFunction, Request, Response } from 'express';
import { errorResponse } from './response';
import jwt from 'jsonwebtoken';

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    errorResponse(res, 401, 'Missing Authorization Token');
    return;
  }

  try {
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
  } catch (error) {
    errorResponse(res, 401, 'Unauthorized');
    next(error);
  }
  next();
};
