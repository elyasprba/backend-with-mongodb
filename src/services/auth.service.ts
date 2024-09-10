import { UserModel } from '../models/users.model';
import { IUserPayload } from '../types/user.types';

export const registerUserService = async (payload: IUserPayload) => {
  try {
    const result = await UserModel.create(payload);

    return result;
  } catch (error) {
    throw error;
  }
};
