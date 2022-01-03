import { ExportSettingGeneralMapping } from "./export-setting.model";

export type DefaultDestinationAttribute = {
  id: number;
  name: string;
}

export interface GeneralMapping extends ExportSettingGeneralMapping {
  id: number;
  bill_payment_account: DefaultDestinationAttribute;
  default_tax_code: DefaultDestinationAttribute;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
