import { MappingSetting, MappingSettingResponse } from "src/app/core/models/db/mapping-setting.model";
import { MappingSourceField, MappingDestinationField } from "src/app/core/models/enum/enum.model";
import { DashboardModule } from "src/app/core/models/misc/dashboard-module.model";


export const modules: DashboardModule[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    iconPath: 'assets/images/svgs/general/dashboard',
    childPages: [],
    isExpanded: false,
    isActive: false
  },
  {
    name: 'Export Log',
    route: 'export_log',
    iconPath: 'assets/images/svgs/general/export-log',
    childPages: [],
    isExpanded: false,
    isActive: false
  },
  {
    name: 'Employee Mapping',
    route: 'mapping',
    iconPath: 'assets/images/svgs/general/mapping',
    isExpanded: false,
    isActive: false,
    childPages: []
  },
  {
    name: 'Configuration',
    route: 'configuration',
    iconPath: 'assets/images/svgs/stepper/configuration',
    isExpanded: false,
    isActive: false,
    childPages: [
      {
        name: 'Map Employees',
        route: 'configuration/employee_settings',
        isActive: false
      },
      {
        name: 'Export Settings',
        route: 'configuration',
        isActive: false
      },
      {
        name: 'Import Settings',
        route: 'configuration/import_settings',
        isActive: false
      },
      {
        name: 'Advanced Settings',
        route: 'configuration/advanced_settings',
        isActive: false
      }
    ]
  }
];
const mappingSetting:MappingSetting[] = [{
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
export const mappingSettingResponse: MappingSettingResponse = {
  count: 0, next: 'aa', previous: 'aa', results: mappingSetting};
