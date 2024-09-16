import { Request, Response, NextFunction } from 'express';
import {
  createPaymentService,
  getPaymentStatusService,
} from '../services/payment.service';
import { errorResponse } from '../middleware/response';
import midtransClient from 'midtrans-client';

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, phone_number, amount } = req.body;

    const price = parseInt(amount);

    const result = await createPaymentService({
      username,
      email,
      phone_number,
      amount: price,
    });

    return res.status(201).json({
      token: result.token,
      redirect_url: result.redirect_url,
    });
  } catch (error) {
    errorResponse(res, 500, 'Internal server error');
    next(error);
  }
};

export const getPaymentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const transaction = await getPaymentStatusService(order_id as string);

    return res.status(200).json({
      message: 'Transaction success',
      transaction,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof midtransClient.MidtransError) {
      // Handle specific Midtrans error
      return res.status(404).json({
        message: 'Midtrans API Error',
        error: error.ApiResponse,
      });
    } else {
      // Handle general error
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
};
