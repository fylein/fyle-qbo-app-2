import { DefaultDestinationAttribute } from "./general-mapping.model";
import { MappingSettingObject } from "./mapping-setting.model";


export type ImportSetting = {
  workspace_general_settings: {
    import_categories: boolean,
    charts_of_accounts: string[],
    import_tax_codes: boolean
  },
  general_mappings: {
    default_tax_code: DefaultDestinationAttribute,
  },
  mapping_settings: MappingSettingObject[]
}

export class ImportSettingModel {
  static constructPayload() {
    return {};
  }
}
