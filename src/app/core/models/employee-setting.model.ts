import { FormGroup } from "@angular/forms";
import { AutoMapEmployee, EmployeeFieldMapping } from "./enum.model";
import { SelectFormOption } from "./select-form-option.model";


export type ExtendedEmployeeSetting = {
  workspace_general_settings: EmployeeSetting;
}

export type EmployeeSetting = {
  employee_field_mapping: EmployeeFieldMapping,
  auto_map_employees: AutoMapEmployee | null
}

export interface EmployeeSettingFormOption extends SelectFormOption {
  value: EmployeeFieldMapping | AutoMapEmployee | '';
}

export class EmployeeSettingModel {
  static constructPayload(employeeSettingsForm: FormGroup): ExtendedEmployeeSetting {
    const employeeSettingPayload: ExtendedEmployeeSetting = {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value
      }
    };
    return employeeSettingPayload;
  }
}
