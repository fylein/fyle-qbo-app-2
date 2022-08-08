import { MappingSetting, MappingSettingPost } from "../../models/db/mapping-setting.model";
import { MappingDestinationField, MappingSourceField } from "../../models/enum/enum.model";

export const mappingSettingPayload: MappingSettingPost[] = [{
  source_field: MappingSourceField.COST_CENTER,
  destination_field: MappingDestinationField.CUSTOMER,
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
}];

export const postMappingSettingResponse: MappingSetting[] = [{
  id: 21,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  source_field: MappingSourceField.COST_CENTER,
  destination_field: MappingDestinationField.CUSTOMER,
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
}];
