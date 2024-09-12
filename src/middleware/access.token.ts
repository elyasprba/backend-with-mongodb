import { NextFunction, Request, Response } from 'express';
import { errorResponse } from './response';
import jwt from 'jsonwebtoken';
import { client } from '../config/redis';
import { CACHE_KEY_CONFIRM_EMAIL } from '../constants/cache.key';

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

  const token = authorization.split(' ')[1];

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string,
    { issuer: process.env.JWT_ACCESS_SECRET },
    (error) => {
      // error handling
      if (error) {
        if (error.name === 'TokenExpiredErroror') {
          return errorResponse(
            res,
            403,
            'Your link expired, please register again.'
          );
        } else if (error.name === 'JsonWebTokenError') {
          return errorResponse(res, 403, 'Invalid token');
        } else {
          return errorResponse(res, 403, 'Unauthorized');
        }
      }

      next();
    }
  );
};

export const checkTokenEmailConfirm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET_CONFIRM as string,
    async (error) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return errorResponse(
            res,
            403,
            'Your link expired, please register again.'
          );
        } else if (error.name === 'JsonWebTokenError') {
          return errorResponse(res, 403, 'Invalid token');
        } else {
          return errorResponse(res, 403, 'Unauthorized');
        }
      }

      try {
        const cachedToken = await client.get(CACHE_KEY_CONFIRM_EMAIL);

        if (!cachedToken) {
          return errorResponse(
            res,
            403,
            'Your link expired, please register again.'
          );
        }

        const parsedData = JSON.parse(cachedToken);
        const { accessTokenConfirm } = parsedData;

        if (accessTokenConfirm !== token) {
          return errorResponse(
            res,
            403,
            'Token Unauthorized, please register again.'
          );
        }

        next();
      } catch (error) {
        return next(error);
      }
    }
  );
};
