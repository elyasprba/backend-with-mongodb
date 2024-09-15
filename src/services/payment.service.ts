import midtrans from '../config/midtrans';

import { IPaymentPayload } from '../types/payment.types';

import { v4 as uuidv4 } from 'uuid';

export const createPaymentService = async (payment: IPaymentPayload) => {
  try {
    const parameter = {
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: payment.amount,
      },
      customer_details: {
        first_name: payment.username,
        email: payment.email,
        phone: payment.phone_number,
      },
      callbacks: {
        finish: `${process.env.CLIENT_URL}/product/payment/status`,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await midtrans.createTransaction(parameter);

    return transaction;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStatusService = async (order_id: string) => {
  try {
    const transaction = await midtrans.transaction.status(order_id);

    return transaction;
  } catch (error) {
    throw error;
  }
};
