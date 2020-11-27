import { UserRole } from "./role.type";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: UserRole;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  __v?: 0;
}
