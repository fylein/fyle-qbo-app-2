import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportSettingGet, ExportSettingPost, ExportSettingFormOption } from '../../models/configuration/export-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

import { AutoMapEmployee, CCCExpenseState, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, ReimbursableExpensesObject } from '../../models/enum/enum.model';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(): Observable<ExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  createReimbursableExpenseWatcher(form: FormGroup, exportSettings: ExportSettingGet): void {
    form.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        form.controls.expenseState.setValidators(Validators.required);
        form.controls.expenseState.setValue(exportSettings.expense_group_settings?.expense_state ? exportSettings.expense_group_settings?.expense_state : ExpenseState.PAYMENT_PROCESSING);
        form.controls.reimbursableExportType.setValidators(Validators.required);
        form.controls.reimbursableExportGroup.setValidators(Validators.required);
        form.controls.reimbursableExportDate.setValidators(Validators.required);
      } else {
        form.controls.expenseState.clearValidators();
        form.controls.reimbursableExportType.clearValidators();
        form.controls.reimbursableExportGroup.clearValidators();
        form.controls.reimbursableExportDate.clearValidators();
        form.controls.expenseState.setValue(null);
        form.controls.reimbursableExportType.setValue(null);
        form.controls.reimbursableExportGroup.setValue(null);
        form.controls.reimbursableExportDate.setValue(null);
      }
    });
  }


  createCreditCardExpenseWatcher(form: FormGroup, exportSettings: ExportSettingGet, isCreditCardExpenseSelected: boolean): void {
    form.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        form.controls.cccExpenseState.setValidators(Validators.required);
        form.controls.cccExpenseState.setValue(exportSettings.expense_group_settings?.ccc_expense_state ? exportSettings.expense_group_settings?.ccc_expense_state : exportSettings.workspace_general_settings.is_simplify_report_closure_enabled ? CCCExpenseState.APPROVED: CCCExpenseState.PAYMENT_PROCESSING);
        form.controls.creditCardExportType.setValidators(Validators.required);
        form.controls.creditCardExportGroup.setValidators(Validators.required);
        form.controls.creditCardExportDate.setValidators(Validators.required);
      } else {
        form.controls.cccExpenseState.clearValidators();
        form.controls.creditCardExportType.clearValidators();
        form.controls.creditCardExportGroup.clearValidators();
        form.controls.creditCardExportDate.clearValidators();
        form.controls.cccExpenseState.setValue(null);
        form.controls.creditCardExportType.setValue(null);
        form.controls.creditCardExportGroup.setValue(null);
        form.controls.creditCardExportDate.setValue(null);
      }
    });
  }


  getReimbursableExportTypeOptions(employeeFieldMapping: EmployeeFieldMapping): ExportSettingFormOption[] {
    return {
      EMPLOYEE: [
        {
          label: 'Check',
          value: ReimbursableExpensesObject.CHECK
        },
        {
          label: 'Expense',
          value: ReimbursableExpensesObject.EXPENSE
        },
        {
          label: 'Journal Entry',
          value: ReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: ReimbursableExpensesObject.BILL
        },
        {
          label: 'Expense',
          value: ReimbursableExpensesObject.EXPENSE
        },
        {
          label: 'Journal Entry',
          value: ReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ]
    }[employeeFieldMapping];
  }

  getcreditCardExportTypes(): ExportSettingFormOption[] {
    return [
      {
        label: 'Bill',
        value: CorporateCreditCardExpensesObject.BILL
      },
      {
        label: 'Credit Card Purchase',
        value: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      },
      {
        label: 'Journal Entry',
        value: CorporateCreditCardExpensesObject.JOURNAL_ENTRY
      },
      {
        label: 'Debit Card Expense',
        value: CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      }
    ];
  }

  getEmployeeFieldMappingOptions(): ExportSettingFormOption[] {
    return [
      {
        label: 'Employees',
        value: EmployeeFieldMapping.EMPLOYEE
      },
      {
        label: 'Vendor',
        value: EmployeeFieldMapping.VENDOR
      }
    ];
  }

  getAutoMapEmployeeOptions(): ExportSettingFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Employee name on Fyle to contact name on Quickbooks',
        value: AutoMapEmployee.NAME
      },
      {
        label: 'Employee email on Fyle to contact email on Quickbooks',
        value: AutoMapEmployee.EMAIL
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): ExportSettingFormOption[] {
    return [
      {
        label: 'Current Date',
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Verification Date',
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: 'Spend Date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval Date',
        value: ExportDateType.APPROVED_AT
      },
      {
        label: 'Last Spend Date',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpenseStateOptions(isSimplifyReportClosureEnabled: boolean): ExportSettingFormOption[] {
    return [
      {
        label: isSimplifyReportClosureEnabled ? 'Processing' : 'Payment Processing',
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: isSimplifyReportClosureEnabled ? 'Closed' : 'Paid',
        value: ExpenseState.PAID
      }
    ];
  }

  getCCCExpenseStateOptions(isSimplifyReportClosureEnabled: boolean): ExportSettingFormOption[] {
    return [
      {
        label: isSimplifyReportClosureEnabled ? 'Approved' : 'Payment Processing',
        value: isSimplifyReportClosureEnabled ? CCCExpenseState.APPROVED: CCCExpenseState.PAYMENT_PROCESSING
      },
      {
        label: isSimplifyReportClosureEnabled ? 'Closed' : 'Paid',
        value: CCCExpenseState.PAID
      }
    ];
  }

  exportSelectionValidator(exportSettingsForm: FormGroup, isCloneSetting: boolean = false): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (exportSettingsForm) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING || control.value === CCCExpenseState.APPROVED)
        && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        } else if (isCloneSetting && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        }

        if (!forbidden) {
          control.parent?.get('expenseState')?.setErrors(null);
          control.parent?.get('cccExpenseState')?.setErrors(null);
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }

      return {
        forbiddenOption: {
          value: control.value
        }
      };
    };
  }
}

