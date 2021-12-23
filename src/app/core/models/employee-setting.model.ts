import { AutoMapEmployee, EmployeeFieldMapping } from "./enum.model";


export type EmployeeSetting = {
  workspace_general_settings: {
    employee_field_mapping: EmployeeFieldMapping,
    auto_map_employees: AutoMapEmployee | null
  }
}

export class EmployeeSettingModel {
  static constructPayload() {
    return {};
  }
}
