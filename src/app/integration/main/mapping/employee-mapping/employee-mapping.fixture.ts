import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { MappingList, MappingStats } from "src/app/core/models/db/mapping.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { EmployeeFieldMapping, MappingState } from "src/app/core/models/enum/enum.model";
import { environment } from "src/environments/environment";

const API_BASE_URL = environment.api_url;
const workspace_id = environment.tests.workspaceId;

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
  state: MappingState.UNMAPPED,
  index: 1
}];
export const workspaceGeneralSettingResponse:WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  is_simplify_report_closure_enabled: true,
  auto_create_merchants_as_vendors: true,
  auto_map_employees: null,
  category_sync_version: "v1",
  change_accounting_period: true,
  charts_of_accounts: ['Expense'],
  corporate_credit_card_expenses_object: null,
  created_at: new Date("2022-04-27T11:07:17.694377Z"),
  employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  id: 1,
  import_categories: false,
  import_projects: false,
  import_items: false,
  import_tax_codes: false,
  import_vendors_as_merchants: false,
  je_single_credit_line: true,
  map_fyle_cards_qbo_account: true,
  map_merchant_to_vendor: false,
  memo_structure: ['Fyle'],
  reimbursable_expenses_object: null,
  skip_cards_mapping: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1
};
export const MappingStatsResponse:MappingStats= {
  all_attributes_count: 3,
  unmapped_attributes_count: 3
};
export const qboData2: DestinationAttribute[] = [{
    id: 2,
    attribute_type: 'EMPLOYEE',
    display_name: "string Ash",
    value: "string Ash",
    destination_id: "stringAsg",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String Ash',
      fully_qualified_name: 'string Ash'
    }
  },
  {
    id: 4,
    attribute_type: 'VENDOR',
    display_name: "string Ash Ash",
    value: "string Ash Ash",
    destination_id: "stringasfash",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String Ash Ash',
      fully_qualified_name: 'string Ash Ash'
    }
  }];
export const qboData: DestinationAttribute[] = [{
  id: 1,
  attribute_type: 'EMPLOYEE',
  display_name: "string",
  value: "string",
  destination_id: "string",
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'String',
    fully_qualified_name: 'string'
  }
},
{
  id: 3,
  attribute_type: 'VENDOR',
  display_name: "string",
  value: "string",
  destination_id: "string",
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'String',
    fully_qualified_name: 'string'
  }
}
];

export const employeeMappingResponse: EmployeeMapping = {
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
    workspace: +environment.tests.workspaceId,
    detail: {
      location: 'india',
      full_name: 'Fyle Integrations',
      department_id: '2',
      department: 'Integrations',
      department_code: 'FYI2',
      employee_code: 'FYIE1'
    }
  },
  destination_employee: qboData2[0],
  destination_vendor: qboData2[1],
  destination_card_account: qboData2[1],
  created_at: new Date(),
  updated_at: new Date(),
  workspace: +environment.tests.workspaceId
};
export const getEmployeeMappingResponse={
  "count": 3,
  "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null&offset=2`,
  "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null`,
  "results": [
    {
      "id": 3,
      "employeemapping": [
        {
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
            workspace: +environment.tests.workspaceId,
            detail: {
              location: 'india',
              full_name: 'Fyle Integrations',
              department_id: '2',
              department: 'Integrations',
              department_code: 'FYI2',
              employee_code: 'FYIE1'
            }
          },
          destination_employee: qboData2[0],
          destination_vendor: qboData2[1],
          destination_card_account: qboData2[1],
          created_at: new Date(),
          updated_at: new Date(),
          workspace: +environment.tests.workspaceId
        }
      ],
      "attribute_type": "EMPLOYEE",
      "display_name": "Employee",
      "value": "gokul.kathiresan@fyle.in",
      "source_id": "oupTTvXHXCuk",
      "auto_mapped": false,
      "auto_created": false,
      "active": null,
      "detail": {
          "user_id": "usCPKib1GyYP",
          "location": null,
          "full_name": "Gokul",
          "department": null,
          "department_id": null,
          "employee_code": null,
          "department_code": null
      },
      "created_at": new Date("2022-04-29T07:14:57.819103Z"),
      "updated_at": new Date("2022-04-29T07:14:57.819149Z"),
      "workspace": workspace_id
    }
  ]
};