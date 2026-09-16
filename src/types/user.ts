export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export type UserCreateInput = {
  email: string;
  password: string;
};

export type UserSession = {
  userId: string;
  email: string;
};
