export type QboConnector = {
  code: string;
  realm_id: string;
}

export interface QboConnectorPost extends QboConnector {
  redirect_uri: string;
}

export type QBOCredentials = {
  id: number;
  refresh_token: string;
  is_expired: boolean;
  realm_id: string;
  country: string;
  company_name: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
