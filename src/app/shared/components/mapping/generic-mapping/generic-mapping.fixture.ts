import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { MappingSetting, MappingSettingResponse, MinimalMappingSetting } from "src/app/core/models/db/mapping-setting.model";
import { MappingList, MappingStats } from "src/app/core/models/db/mapping.model";
import { MappingDestinationField, MappingSourceField, MappingState } from "src/app/core/models/enum/enum.model";
import { environment } from "src/environments/environment";
const API_BASE_URL = environment.api_url;
const workspace_id = environment.tests.workspaceId;
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
      value: 'string'
  },
  qbo: {
      id: 'string',
      value: 'string'
  },
  preserveDestination: {
      id: 'string'
  },
  autoMapped: true,
  state: MappingState.ALL,
  index: 0
},
{
  fyle: {
      id: 1,
      value: 'string'
  },
  qbo: {
      id: 'string',
      value: 'string'
  },
  preserveDestination: {
      id: 'string'
  },
  autoMapped: true,
  state: MappingState.UNMAPPED,
  index: 1
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
export const response1 = {
  "count": 125,
  "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
  "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
  "results": [
    {
      mapping: [{
        id: 1,
        source: {
          id: 1,
          attribute_type: 'string',
          display_name: 'string',
          value: 'string',
          source_id: 1,
          auto_mapped: true,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
          detail: {
            location: 'string',
            full_name: 'string',
            department_id: 'string',
            department: 'string',
            department_code: 'string',
            employee_code: 'string'
          }
        },
        destination: {
          id: 1,
          attribute_type: 'VENDOR',
          display_name: 'Vendor',
          value: 'dummy',
          destination_id: '1',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: +workspace_id,
          detail: {
            email: 'dummy@gmail.com',
            fully_qualified_name: 'Fyle'
          }
        },
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 2
      }
      ]

    }
  ]
};
export const getMappingSettingResponse: MappingSettingResponse = {
  count: 0, next: 'aa', previous: 'aa', results: mappingSetting
};
export const getMappingStats: MappingStats = {
  all_attributes_count: 3,
  unmapped_attributes_count: 3
};
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
}];
