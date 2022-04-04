import { MappingDestinationField, MappingSourceField } from "../enum/enum.model";

export type MappingSetting = {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null
}
