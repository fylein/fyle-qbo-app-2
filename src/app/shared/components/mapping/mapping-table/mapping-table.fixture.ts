import { UntypedFormBuilder } from "@angular/forms";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { MappingList } from "src/app/core/models/db/mapping.model";
import { MappingState } from "src/app/core/models/enum/enum.model";

let formBuilder: UntypedFormBuilder;
export const mappingList: MappingList[] = [{
  fyle: {
    id: 1,
    value: 'string'
  },
  qbo: {
    id: 1,
    value: "string"
  },
  preserveDestination: {
    id: 1
  },
  autoMapped: true,
  state: MappingState.MAPPED,
  index: 0
}];

export const destinationAttribute: DestinationAttribute[] = [{
  active: true,
  attribute_type: "ACCOUNT",
  created_at: new Date("2022-06-14T06:24:56.947727Z"),
  destination_id: "800",
  detail: { email: 'fyle@fyle.in', fully_qualified_name: 'Fyle' },
  display_name: "Account",
  id: 1,
  updated_at: new Date("2022-06-14T06:24:56.947727Z"),
  value: "Accounts Payable",
  workspace: 146
},
{
  id: 2,
  attribute_type: 'Account',
  display_name: "string Ash",
  value: "string",
  destination_id: "stringAsg",
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'String Ash',
    fully_qualified_name: 'string Ash'
  }
}];
