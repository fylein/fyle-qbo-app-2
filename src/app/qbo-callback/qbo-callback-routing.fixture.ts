import { NavigationExtras } from "@angular/router";

export const response={
  id: 1,
  refresh_token: 'fyle',
  is_expired: false,
  realm_id: 'realmId',
  country: 'india',
  company_name: 'Fyle',
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2
};
export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO',
    message: 'Please choose the correct Quickbooks online account'
  }
};
export const errorResponse1 = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};

