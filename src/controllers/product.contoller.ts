import { Request, NextFunction, Response } from 'express';
import { errorResponse, successResponse } from '../middleware/response';
import {
  createProductService,
  getAllProductService,
} from '../services/product.service';

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

export const getAllProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllProductService();

    successResponse(res, 200, 'Get all product success', result);
  } catch (error) {
    errorResponse(res, 500, 'Internal Service Error');
    next(error);
  }
};
