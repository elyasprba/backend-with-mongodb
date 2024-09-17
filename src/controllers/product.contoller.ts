import { NextFunction, Request, Response } from 'express';
import { createProductService } from '../services/product.service';
import { errorResponse, successResponse } from '../middleware/response';

export const createProductContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, stock, description, image, user_id } = req.body;

    const result = await createProductService({
      name,
      price,
      stock,
      description,
      image,
      user_id,
    });

    successResponse(res, 201, 'Product created successfully', result);
  } catch (error) {
    errorResponse(res, 500, 'Internal Service Error');
    next(error);
  }
};
