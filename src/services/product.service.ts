import { IProductPayload } from '../types/product.types';
import { ProductModel } from '../models/product.model';

export const createProductService = async (
  payload: IProductPayload,
  file: { path: string }
) => {
  try {
    const { name, price, stock, description, user_id } = payload;

    if (!name || !price || !stock || !description || !user_id) {
      return 'Wajib disi';
    }

    const image = file ? file.path : null;

    const result = await ProductModel.create({
      name,
      price,
      stock,
      description,
      image,
      user_id,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
