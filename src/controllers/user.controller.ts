import { Request, Response } from 'express';
import { getUsersByIdService, getUsersService } from '../services/user.service';
import { errorResponse } from '../middleware/response';
import { client } from '../config/redis';

export const getUserController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const search = {
      id: req.query.id as string,
      email: req.query.email as string,
      username: req.query.username as string,
    };

    const cacheKey = `user_${JSON.stringify(search)}_${page}_${limit}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      const result = JSON.parse(cachedData);
      return res.json({
        message: 'Get users success from cache',
        data: result.data,
        result_data: result.result_data,
        result_page: result.result_page,
        current_page: result.current_page,
      });
    }

    const result = await getUsersService(page, limit, search);

    await client.set(cacheKey, JSON.stringify(result), { EX: 60 }); // Expire dalam 1 menit

    res.status(200).json({
      message: 'Get users success',
      data: result.data,
      result_data: result.result_data,
      result_page: result.result_page,
      current_page: result.current_page,
    });
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export const getUsersByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getUsersByIdService(id);

    res.status(200).json({
      message: 'Get user success',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage =
      error.message || error?.message?.message || 'An error occurred';
    errorResponse(res, 404, errorMessage);
  }
};
