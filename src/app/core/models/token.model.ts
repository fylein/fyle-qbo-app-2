import { User } from "./user";

export type Token = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: User;
};
