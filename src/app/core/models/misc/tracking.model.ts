import { AdvancedSettingGet } from "../configuration/advanced-setting.model";
import { EmployeeSettingGet } from "../configuration/employee-setting.model";
import { ExportSettingGet } from "../configuration/export-setting.model";
import { ImportSettingGet } from "../configuration/import-setting.model";
import { CorporateCreditCardExpensesObject, PaginatorPage, ProgressPhase, ReimbursableExpensesObject } from "../enum/enum.model";

export type ClickEventAdditionalProperty = {
  phase: ProgressPhase,
  exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject | null,
  previousPageNumber: number,
  newPageNumber: number,
  page: string
};

export type UpdateEventAdditionalProperty = {
  phase: ProgressPhase,
  page: PaginatorPage,
  oldState: EmployeeSettingGet | ExportSettingGet | ImportSettingGet | AdvancedSettingGet | number,
  newState: EmployeeSettingGet | ExportSettingGet | ImportSettingGet | AdvancedSettingGet | number
};
