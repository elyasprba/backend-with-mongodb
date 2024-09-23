import { Request, NextFunction, Response } from 'express';
import { errorResponse, successResponse } from '../middleware/response';
import {
  createProductService,
  getAllProductService,
} from '../services/product.service';
import { client } from '../config/redis';

import { IProductPayload } from '../types/product.types';

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file = null } = req;
    const { name, price, stock, description, user_id, category } = req.body;

    if (!file) {
      return errorResponse(res, 400, 'Image not found');
    }

    const productPayload: IProductPayload = {
      name,
      price,
      stock,
      description,
      user_id,
      category,
    };

    const result = await createProductService(productPayload, file);

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
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const search = {
      name: req.query.name as string,
      category: req.query.category as string,
    };

    const cacheKey = `product_${JSON.stringify(search)}_${page}_${limit}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      const result = JSON.parse(cachedData);
      return res.json({
        message: 'Get products success from cache',
        data: result.data,
        result_data: result.result_data,
        result_page: result.result_page,
        current_page: result.current_page,
      });
    }

    const result = await getAllProductService(page, limit, search);

    await client.set(cacheKey, JSON.stringify(result), { EX: 60 });

    res.status(200).json({
      message: 'Get products success',
      data: result.data,
      result_data: result.result_data,
      result_page: result.result_page,
      current_page: result.current_page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Service Error' });
    next(error);
  }
};
