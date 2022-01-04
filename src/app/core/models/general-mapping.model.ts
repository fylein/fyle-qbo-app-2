import { ExportSettingGeneralMapping } from "./export-setting.model";
import { ImportSettingGeneralMapping } from "./import-setting.model";

export type DefaultDestinationAttribute = {
  id: number;
  name: string;
}

export interface GeneralMapping extends ExportSettingGeneralMapping, ImportSettingGeneralMapping {
  id: number;
  bill_payment_account: DefaultDestinationAttribute;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
