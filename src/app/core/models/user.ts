export type User = {
  active: boolean;
  admin: boolean;
  email: string;
  full_name: string;
  id: number;
  last_login: null;
  password: '';
  staff: boolean;
  user_id: string;
  // TODO: add support for this in fyle-rest-auth
  org_id: string;
  org_name: string;
}

export type MinimalUser = {
  email: string;
  access_token: string;
  refresh_token: string;
  full_name: string;
  user_id: string;
  org_id: string;
  org_name: string;
}
