export interface User extends MinimalUser {
  active: boolean;
  admin: boolean;
  id: number;
  last_login: null;
  password: '';
  staff: boolean;
}

export interface MinimalUser {
  email: string;
  access_token: string;
  refresh_token: string;
  full_name: string;
  user_id: string;
  // TODO: add support for this in fyle-rest-auth
  org_id: string;
  org_name: string;
}
