export type DestinationAttributeDetail = {
  email: string;
  account_type?: string;
  fully_qualified_name: string;
};

export type DestinationAttribute = {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  destination_id: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: DestinationAttributeDetail;
};

export type GroupedDestinationAttribute = {
  BANK_ACCOUNT: DestinationAttribute[];
  CREDIT_CARD_ACCOUNT: DestinationAttribute[];
  ACCOUNTS_PAYABLE: DestinationAttribute[];
  VENDOR: DestinationAttribute[];
  ACCOUNT: DestinationAttribute[];
  TAX_CODE: DestinationAttribute[];
};
