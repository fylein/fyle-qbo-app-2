import { UntypedFormGroup } from "@angular/forms";
import { AutoMapEmployee, EmployeeFieldMapping } from "../enum/enum.model";
import { SelectFormOption } from "../misc/select-form-option.model";

export type EmployeeSettingWorkspaceGeneralSetting = {
  employee_field_mapping: EmployeeFieldMapping,
  auto_map_employees: AutoMapEmployee | null
}

export type EmployeeSettingPost = {
  workspace_general_settings: EmployeeSettingWorkspaceGeneralSetting;
}

export type EmployeeSettingGet = {
  workspace_general_settings: EmployeeSettingWorkspaceGeneralSetting,
  workspace_id: number
}

export interface EmployeeSettingFormOption extends SelectFormOption {
  value: EmployeeFieldMapping | AutoMapEmployee | '' | null;
}

export class EmployeeSettingModel {
  static constructPayload(employeeSettingsForm: UntypedFormGroup): EmployeeSettingPost {
    const employeeSettingPayload: EmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value
      }
    };
    return employeeSettingPayload;
  }
}
