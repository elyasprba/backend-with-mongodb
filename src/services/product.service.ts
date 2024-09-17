import { IProductPayload } from '../types/product.types';
import { ProductModel } from '../models/product.model';

export const createProductService = async (payload: IProductPayload) => {
  try {
    const result = await ProductModel.create(payload);

    return result;
  } catch (error) {
    throw error;
  }
};
