import { MappingDestinationField, MappingSourceField } from "./enum.model";

export type MappingSettingObject = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField,
  import_to_fyle: boolean,
  is_custom: boolean
}
