import { MappingState } from "../enum/enum.model";
import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";

export type Mapping = {
  id: number;
  source: ExpenseAttribute;
  source_value: string;
  destination: DestinationAttribute;
  source_type: string;
  destination_type: string;
  destination_value: string;
  destination_id: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};

export type MappingList = {
  fyle: string;
  autoMapped: boolean;
  qbo: string;
  state: MappingState;
}
