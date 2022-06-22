import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { MappingSetting, MinimalMappingSetting } from "src/app/core/models/db/mapping-setting.model";
import { MappingList } from "src/app/core/models/db/mapping.model";
import { MappingDestinationField, MappingSourceField, MappingState } from "src/app/core/models/enum/enum.model";

export const mappingSetting:MappingSetting[] = [{
  id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  source_field: MappingSourceField.PROJECT,
  destination_field: MappingDestinationField.CUSTOMER,
  import_to_fyle: true,
  is_custom: true,
  source_placeholder: 'string'
}];
export const mappinglist: MappingList[] = [{
  fyle: {
      id: 1,
      value: 'string',
  },
  qbo: {
      id: 'string',
      value: 'string',
  },
  preserveDestination: {
      id: 'string',
  },
  autoMapped: true,
  state: MappingState.ALL,
  index: 0,
},
{
  fyle: {
      id: 1,
      value: 'string',
  },
  qbo: {
      id: 'string',
      value: 'string',
  },
  preserveDestination: {
      id: 'string',
  },
  autoMapped: true,
  state: MappingState.UNMAPPED,
  index: 1,
}];
export const minimaMappingSetting:MinimalMappingSetting = {
  source_field: MappingSourceField.PROJECT,
  destination_field: MappingDestinationField.CUSTOMER
};

const destination:DestinationAttribute = {
  id: 1,
  attribute_type: 'VENDOR',
  display_name: 'Vendor',
  value: 'dummy',
  destination_id: '1',
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'dummy@gmail.com',
    fully_qualified_name: 'Fyle'
  }
};
export const response:EmployeeMapping = {
  id: 1,
  source_employee: {
    id: 1,
    attribute_type: 'VENDOR',
    display_name: 'Vendor',
    value: 'dummy',
    source_id: 1,
    auto_mapped: true,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      location: 'india',
      full_name: 'Fyle Integrations',
      department_id: '2',
      department: 'Integrations',
      department_code: 'FYI2',
      employee_code: 'FYIE1'
    }
  },
  destination_employee: destination,
  destination_vendor: destination,
  destination_card_account: destination,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2
};
