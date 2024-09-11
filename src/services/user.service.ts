import { UserModel } from '../models/users.model';

export const getUsersService = async (
  page: number,
  limit: number,
  search?: { id?: string; email?: string; username?: string }
) => {
  try {
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search?.id) {
      query._id = search.id;
    }
    if (search?.email) {
      query.email = search.email;
    }
    if (search?.username) {
      query.username = search.username;
    }

    const result = await UserModel.find(query)
      .select('-password -refresh_token -__v')
      .skip(skip)
      .limit(limit);

    const resultCount = await UserModel.countDocuments();

    return {
      data: result,
      result_data: resultCount,
      result_page: Math.ceil(resultCount / limit),
      current_page: page - 0,
    };
  } catch (error) {
    throw error;
  }
};
