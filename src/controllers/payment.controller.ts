import { Request, Response } from 'express';
import {
  createPaymentService,
  getPaymentStatusService,
} from '../services/payment.service';
import { errorResponse } from '../middleware/response';

export const createPaymentController = async (req: Request, res: Response) => {
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
    errorResponse(res, 500, error);
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
      message: 'Transaction completed',
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
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
