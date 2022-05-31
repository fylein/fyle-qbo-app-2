import { AdvancedSettingGet } from "../configuration/advanced-setting.model";
import { EmployeeSettingGet } from "../configuration/employee-setting.model";
import { ExportSettingGet } from "../configuration/export-setting.model";
import { ImportSettingGet } from "../configuration/import-setting.model";
import { CorporateCreditCardExpensesObject, ErrorType, PaginatorPage, ProgressPhase, ReimbursableExpensesObject } from "../enum/enum.model";

export type ClickEventAdditionalProperty = {
  phase: ProgressPhase,
  exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject | null,
  previousPageNumber: number,
  newPageNumber: number,
  page: string,
  oldCompanyName: string | null
};

export type UpdateEventAdditionalProperty = {
  phase: ProgressPhase,
  page: PaginatorPage,
  oldState: EmployeeSettingGet | ExportSettingGet | ImportSettingGet | AdvancedSettingGet | number,
  newState: EmployeeSettingGet | ExportSettingGet | ImportSettingGet | AdvancedSettingGet | number
};

export type TimeTakenAdditionalProperty = {
  durationInSeconds: number,
  phase: ProgressPhase,
  eventState: 'success' | 'navigated'
};

export type ResolveMappingErrorProperty = {
  resolvedCount: number,
  unresolvedCount: number,
  totalCount: number,
  resolvedAllErrors: boolean,
  startTime: Date,
  endTime: Date,
  durationInSeconds: number,
  errorType: ErrorType
};

export type MappingAlphabeticalFilterAdditionalProperty = {
  alphabetList: string[],
  allSelected: boolean,
  page: string
};
