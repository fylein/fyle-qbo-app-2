import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeFieldMapping, ExpenseState, ReimbursableExpensesObject } from 'src/app/core/models/enum.model';
import { ExportSetting, ExportSettingFormOption } from 'src/app/core/models/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/export-setting.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  exportSettingsForm: FormGroup;
  expenseStateOptions: ExportSettingFormOption[] = [
    {
      value: ExpenseState.PAYMENT_PROCESSING,
      label: 'Payment Processing'
    },
    {
      value: ExpenseState.PAID,
      label: 'Paid'
    }
  ];

  reimbursableExportTypes: ExportSettingFormOption[];

  getReimbursableExportTypes(employeeFieldMapping: EmployeeFieldMapping): ExportSettingFormOption[] {
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

  constructor(
    private formBuilder: FormBuilder,
    private exportSettingService: ExportSettingService
  ) { }

  setupForm(): void {
    this.exportSettingService.getExportSettings().subscribe((exportSettings: ExportSetting) => {
      this.reimbursableExportTypes = this.getReimbursableExportTypes(exportSettings.workspace_general_settings.employee_field_mapping);
      this.exportSettingsForm = this.formBuilder.group({
        expenseState: [exportSettings.expense_group_settings.expense_state, Validators.required],
        reimbursableExpense: [exportSettings.workspace_general_settings?.reimbursable_expenses_object, Validators.nullValidator],
        reimbursableExportType: [exportSettings.workspace_general_settings?.reimbursable_expenses_object, Validators.nullValidator],
      });
      this.isLoading = false;
    });
  }

  save(): void {
    console.log('this.exportSettingsForm',this.exportSettingsForm)
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
