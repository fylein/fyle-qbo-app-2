import { DestinationAttribute, PaginatedDestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { MappingSetting, MappingSettingResponse, MinimalMappingSetting } from "src/app/core/models/db/mapping-setting.model";
import { MappingList, MappingPost, MappingStats } from "src/app/core/models/db/mapping.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { EmployeeFieldMapping, FyleField, MappingDestinationField, MappingSourceField, MappingState, QBOField } from "src/app/core/models/enum/enum.model";
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

export const minimaMappingSetting2:MinimalMappingSetting = {
  source_field: FyleField.CATEGORY,
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
  "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
  "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
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

export const getWorkspaceGeneralSettingsResponse: WorkspaceGeneralSetting = {
  id: 1,
  import_projects: true,
  created_at: new Date("2022-06-14T06:24:56.947727Z"),
  updated_at: new Date("2022-06-14T06:24:56.947727Z"),
  workspace: 1,
  employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  auto_map_employees: null,
  reimbursable_expenses_object: null,
  corporate_credit_card_expenses_object: null,
  import_categories: true,
  import_items: false,
  import_vendors_as_merchants: false,
  charts_of_accounts: ['Expense'],
  import_tax_codes: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  auto_create_destination_entity: false,
  auto_create_merchants_as_vendors: false,
  je_single_credit_line: false,
  change_accounting_period: false,
  memo_structure: ['employee_email', 'category', 'spent_on', 'report_number', 'purpose', 'expense_link'],
  category_sync_version: 'v2',
  map_fyle_cards_qbo_account: false,
  map_merchant_to_vendor: false,
  skip_cards_mapping: false,
  is_simplify_report_closure_enabled: false
};

export const getMappingStats: MappingStats = {
  all_attributes_count: 3,
  unmapped_attributes_count: 3
};
export const destinationAttribute: PaginatedDestinationAttribute = {
  count: 1,
  next: '',
  previous: '',
  results: [{
    active: true,
    attribute_type: "ACCOUNT",
    created_at: new Date("2022-06-14T06:24:56.947727Z"),
    destination_id: "800",
    detail: { email: 'fyle@fyle.in', fully_qualified_name: 'Fyle' },
    display_name: "Account",
    id: 1,
    updated_at: new Date("2022-06-14T06:24:56.947727Z"),
    value: "Delhi",
    workspace: 146
  }],
}
export const getMappingsresponse = {
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 363953,
      "mapping": [
        {
          "destination": {
            "id": 50140,
            "attribute_type": "DEPARTMENT",
            "display_name": "Department",
            "value": "Accountants Inc",
            "destination_id": "4",
            "auto_created": false,
            "active": true,
            "detail": null,
            "created_at": "2022-05-12T03:58:18.256948Z",
            "updated_at": "2022-05-12T03:58:18.256966Z",
            "workspace": 286
          },
          "source_type": "HGFH",
          "destination_type": "DEPARTMENT",
          "created_at": "2022-07-14T11:41:07.465208Z",
          "updated_at": "2022-07-14T11:41:07.465230Z"
        }
      ],
      "attribute_type": "HGFH",
      "display_name": "Hgfh",
      "value": "Activity",
      "source_id": "expense_custom_field.hgfh.1",
      "auto_mapped": true,
      "auto_created": false,
      "active": true,
      "detail": {
        "placeholder": "Select Hgfh",
        "custom_field_id": 209230
      },
      "created_at": "2022-07-14T11:41:06.207847Z",
      "updated_at": "2022-07-14T11:41:06.207873Z",
      "workspace": 286
    },
    {
      "id": 363954,
      "mapping": [],
      "attribute_type": "HGFH",
      "display_name": "Hgfh",
      "value": "Bangalore",
      "source_id": "expense_custom_field.hgfh.2",
      "auto_mapped": true,
      "auto_created": false,
      "active": true,
      "detail": {
        "placeholder": "Select Hgfh",
        "custom_field_id": 209230
      },
      "created_at": "2022-07-14T11:41:06.207906Z",
      "updated_at": "2022-07-14T11:41:06.207913Z",
      "workspace": 286
    },
    {
      "id": 363958,
      "mapping": [
        {
          "destination": {
            "id": 50142,
            "attribute_type": "DEPARTMENT",
            "display_name": "Department",
            "value": "Bebe Rexha",
            "destination_id": "2",
            "auto_created": false,
            "active": true,
            "detail": null,
            "created_at": "2022-05-12T03:58:18.257017Z",
            "updated_at": "2022-05-12T03:58:18.257023Z",
            "workspace": 286
          },
          "source_type": "HGFH",
          "destination_type": "DEPARTMENT",
          "created_at": "2022-07-14T11:41:07.465273Z",
          "updated_at": "2022-07-14T11:41:07.465279Z"
        }
      ],
      "attribute_type": "HGFH",
      "display_name": "Hgfh",
      "value": "Bebe Rexha",
      "source_id": "expense_custom_field.hgfh.6",
      "auto_mapped": true,
      "auto_created": false,
      "active": true,
      "detail": {
        "placeholder": "Select Hgfh",
        "custom_field_id": 209230
      },
      "created_at": "2022-07-14T11:41:06.208037Z",
      "updated_at": "2022-07-14T11:41:06.208043Z",
      "workspace": 286
    },
    {
      "id": 363956,
      "mapping": [
        {
          "destination": {
            "id": 58701,
            "attribute_type": "DEPARTMENT",
            "display_name": "Department",
            "value": "Chennai",
            "destination_id": "5",
            "auto_created": false,
            "active": true,
            "detail": null,
            "created_at": "2022-07-14T11:41:04.540856Z",
            "updated_at": "2022-07-14T11:41:04.540879Z",
            "workspace": 286
          },
          "source_type": "HGFH",
          "destination_type": "DEPARTMENT",
          "created_at": "2022-07-14T11:41:07.465318Z",
          "updated_at": "2022-07-14T11:41:07.465323Z"
        }
      ],
      "attribute_type": "HGFH",
      "display_name": "Hgfh",
      "value": "Chennai",
      "source_id": "expense_custom_field.hgfh.4",
      "auto_mapped": true,
      "auto_created": false,
      "active": true,
      "detail": {
        "placeholder": "Select Hgfh",
        "custom_field_id": 209230
      },
      "created_at": "2022-07-14T11:41:06.207974Z",
      "updated_at": "2022-07-14T11:41:06.207979Z",
      "workspace": 286
    },
    {
      "id": 363955,
      "mapping": [
        {
          "destination": {
            "id": 58702,
            "attribute_type": "DEPARTMENT",
            "display_name": "Department",
            "value": "Delhi",
            "destination_id": "6",
            "auto_created": false,
            "active": true,
            "detail": null,
            "created_at": "2022-07-14T11:41:04.540903Z",
            "updated_at": "2022-07-14T11:41:04.540909Z",
            "workspace": 286
          },
          "source_type": "HGFH",
          "destination_type": "DEPARTMENT",
          "created_at": "2022-07-14T11:41:07.465341Z",
          "updated_at": "2022-07-14T11:41:07.465346Z"
        }
      ],
      "attribute_type": "HGFH",
      "display_name": "Hgfh",
      "value": "Delhi",
      "source_id": "expense_custom_field.hgfh.3",
      "auto_mapped": true,
      "auto_created": false,
      "active": true,
      "detail": {
        "placeholder": "Select Hgfh",
        "custom_field_id": 209230
      },
      "created_at": "2022-07-14T11:41:06.207941Z",
      "updated_at": "2022-07-14T11:41:06.207947Z",
      "workspace": 286
    }
  ]
};

const payload: MappingPost = {
  source_type: 'Payment',
  source_value: 'dummy',
  destination_type: 'Expence',
  destination_id: '1',
  destination_value: 'dummy'
};
export const postMappingsresponse:EmployeeMapping = {
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
    workspace: +workspace_id,
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
  workspace: +workspace_id
};
