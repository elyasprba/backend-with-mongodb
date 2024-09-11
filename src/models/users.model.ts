import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = model('users', userSchema);
