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
      username: username ? username : 'anonymous',
      email: email ? email : 'anonymous@gmail.com',
      phone_number: phone_number ? phone_number : '08123456789',
      amount: price ? price : 10000,
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

    switch (transaction.transaction_status) {
      case 'pending':
        return res.status(200).json({
          message: 'Transaction is still pending',
          data: {
            order_id: transaction.order_id,
            transaction_status: transaction.transaction_status,
            transaction_time: transaction.transaction_time,
          },
        });

      case 'settlement':
        return res.status(200).json({
          message: 'Transaction completed successfully',
          data: {
            status: transaction.status_code,
            transaction_id: transaction.transaction_id,
            amount: transaction.gross_amount,
            order_id: transaction.order_id,
            payment_type: transaction.payment_type,
            transaction_status: transaction.transaction_status,
            fraud_status: transaction.fraud_status,
            status_message: transaction.status_message,
            transaction_time: transaction.transaction_time,
          },
        });

      case 'failed':
        return res.status(200).json({
          message: 'Transaction failed',
          data: {
            status: transaction.status_code,
            transaction_id: transaction.transaction_id,
            order_id: transaction.order_id,
            transaction_status: transaction.transaction_status,
            transaction_time: transaction.transaction_time,
          },
        });

      default:
        return res.status(200).json({
          message: 'Transaction status is unknown',
        });
    }
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
