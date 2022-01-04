import { MappingDestinationField, MappingSourceField } from "./enum.model";
import { DefaultDestinationAttribute, GeneralMapping } from "./general-mapping.model";
import { MappingSetting } from "./mapping-setting.model";
import { WorkspaceGeneralSetting } from "./workspace-general-setting.model";


export type ImportSettingPost = {
  workspace_general_settings: ImportSettingWorkspaceGeneralSetting,
  general_mappings: ImportSettingGeneralMapping,
  mapping_settings: ImportSettingMappingSetting[]
}

export type ImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean
}

export type ImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type ImportSettingMappingSetting = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField,
  import_to_fyle: boolean,
  is_custom: boolean
}

export type ImportSettingGet = {
  workspace_general_settings: WorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  mapping_settings: MappingSetting[]
}


export class ImportSettingModel {
  static constructPayload() {
    return {};
  }
}
