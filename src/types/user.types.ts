export interface IUserPayloadRegister {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUserPayloadLogin {
  email: string;
  password: string;
}

export interface IUserUpdate {
  username?: string;
  role?: string;
}
