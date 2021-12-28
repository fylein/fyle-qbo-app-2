import { FormGroup } from "@angular/forms";
import { AutoMapEmployee, EmployeeFieldMapping } from "./enum.model";


export type EmployeeSetting = {
  workspace_general_settings: {
    employee_field_mapping: EmployeeFieldMapping,
    auto_map_employees: AutoMapEmployee | null
  }
}

export interface EmployeeSettingFormOptions {
  label: string;
  value: EmployeeFieldMapping | AutoMapEmployee | '';
}

export class EmployeeSettingModel {
  static constructPayload(employeeSettingsForm: FormGroup): EmployeeSetting {
    const employeeSettingPayload: EmployeeSetting = {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value
      }
    };
    return employeeSettingPayload;
  }
}
