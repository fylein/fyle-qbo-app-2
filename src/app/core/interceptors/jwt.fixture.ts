import { Token } from "../models/misc/token.model";

export const response = {
  access_token: "fylee",
  expires_in: 3600,
  refresh_token: "ffff",
  token_type: "Bearer"
};
export const response1: Token = {
  access_token: "",
  expires_in: 3600,
  refresh_token: "ffff",
  token_type: "Bearer",
  user: {
    access_token: "",
    email: "sravan.kumar@fyle.in",
    full_name: "sravan k",
    org_id: "orunxXsIajSE",
    org_name: "Test Sample Statement - GBP",
    refresh_token: "",
    user_id: "ust5Ga9HC3qc",
    active: true,
    admin: true,
    id: 1,
    last_login: null,
    password: '',
    staff: true
  }
};
export const errorResponse1 = {
  status: 401,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};