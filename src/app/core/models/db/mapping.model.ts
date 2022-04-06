import { MappingState } from "../enum/enum.model";
import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";
import { MappingSetting } from "./mapping-setting.model";

export interface Mapping extends MappingPost {
  id: number;
  source: ExpenseAttribute;
  destination: DestinationAttribute;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};

export type MappingPost = {
  source_type: string;
  source_value: string;
  destination_type: string;
  destination_id: string;
  destination_value: string;
};

export type MappingResponse = {
  count: number;
  next: string;
  previous: string;
  results: Mapping[];
};

export type MappingList = {
  fyle: {
    id: number;
    value: string;
  };
  qbo: {
    id: number | string;
    value: string;
  };
  preserveDestination?: {
    id: number;
  }
  autoMapped: boolean;
  state: MappingState;
  index: number;
};

export type MappingStats = {
  mapped_attributes_count: number;
  unmapped_attributes_count: number;
};

export class MappingModel {
  static constructPayload(mappingSetting: MappingSetting, mappingRow: MappingList): MappingPost {
    return {
      source_type: mappingSetting.source_field,
      source_value: mappingRow.fyle.value,
      destination_type: mappingSetting.destination_field,
      destination_id: mappingRow.qbo.id.toString(),
      destination_value: mappingRow.qbo.value
    };
  }
}
