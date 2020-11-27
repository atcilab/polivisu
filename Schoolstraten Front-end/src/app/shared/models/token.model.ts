import { UserRole } from "./role.type";

export interface IToken {
  _id: string;
  role: UserRole;
  iat: number;
  exp: number;
}
