import { IProductPayload } from '../types/product.types';
import { ProductModel } from '../models/product.model';

export const createProductService = async (
  payload: IProductPayload,
  file: { path: string }
) => {
  try {
    const { name, price, stock, description, user_id, category } = payload;

    const image = file ? file.path : null;

    const result = await ProductModel.create({
      name,
      price,
      stock,
      description,
      image,
      user_id,
      category,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllProductService = async (
  page: number,
  limit: number,
  search?: { name?: string; category?: string }
) => {
  try {
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search?.name) {
      query.name = new RegExp(search.name, 'i');
    }
    if (search?.category) {
      query.category = new RegExp(search.category, 'i');
    }

    const products = await ProductModel.find(query)
      .select('-__v -user_id')
      .skip(skip)
      .limit(limit);

    const totalItems = await ProductModel.countDocuments(query);

    return {
      data: products,
      result_data: totalItems,
      result_page: Math.ceil(totalItems / limit),
      current_page: page,
    };
  } catch (error) {
    throw error;
  }
};
