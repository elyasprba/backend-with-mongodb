import { Request, NextFunction, Response } from 'express';
import { errorResponse, successResponse } from '../middleware/response';
import { createProductService } from '../services/product.service';

export const createProductContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file = null } = req;

    if (!file) {
      errorResponse(res, 400, 'image not found');
      return;
    }

    const result = await createProductService(req.body, file);

    successResponse(res, 201, 'Product created successfully', result);
  } catch (error) {
    errorResponse(res, 500, 'Internal Service Error');
    next(error);
  }
};
