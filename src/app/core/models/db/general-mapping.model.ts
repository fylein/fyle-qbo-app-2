export type DefaultDestinationAttribute = {
  id: string,
  name: string,
};

export type MinimalDestinationAttribute = {
  id: number | null;
}

export type GeneralMapping = {
  id: number,
  created_at: Date,
  updated_at: Date,
  workspace: number,
  bill_payment_account: DefaultDestinationAttribute,
  bank_account: DefaultDestinationAttribute,
  default_ccc_account: DefaultDestinationAttribute,
  accounts_payable: DefaultDestinationAttribute,
  default_ccc_vendor: DefaultDestinationAttribute,
  qbo_expense_account: DefaultDestinationAttribute,
  default_debit_card_account: DefaultDestinationAttribute,
  default_tax_code: DefaultDestinationAttribute
};
