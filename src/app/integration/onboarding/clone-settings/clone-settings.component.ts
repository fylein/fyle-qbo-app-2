import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CloneSetting } from 'src/app/core/models/configuration/clone-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { ClickEvent, EmployeeFieldMapping, OnboardingStep, PaymentSyncDirection, ReimbursableExpensesObject, ProgressPhase, SimpleSearchPage, SimpleSearchType,  } from 'src/app/core/models/enum/enum.model';


@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent {

  isLoading: boolean = true;
  
  cloneSettingsForm: FormGroup;
  
  autoMapEmployeeTypes: ExportSettingFormOption[] = this.exportSettingService.getAutoMapEmployeeOptions();
  
  reimbursableExportOptions: ExportSettingFormOption[];
  
  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  employeeFieldMappingOptions: ExportSettingFormOption[] = this.exportSettingService.getEmployeeFieldMappingOptions();

  bankAccounts: DestinationAttribute[];
  
  cloneSettings: CloneSetting;
  
  reimbursableExpenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];
  
  cccExpenseExportOptions: ExportSettingFormOption[];

  ProgressPhase = ProgressPhase;

  constructor(
    private exportSettingService: ExportSettingService,
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private cloneSettingService: CloneSettingService,
  ) { }
  
  
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

  
  private setupForm(): void {
    this.cloneSettingsForm = this.formBuilder.group({
      reimbursableExpense: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object],
      autoMapEmployees: [this.cloneSettings.employee_mappings.workspace_general_settings.auto_map_employees],
      reimbursableExportDate: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_export_date_type],
      reimbursableExpenseState: [this.cloneSettings.export_settings.expense_group_settings.expense_state],
      reimbursableExportTypes: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object],
      employeeFieldMapping: [this.cloneSettings.employee_mappings.workspace_general_settings.employee_field_mapping],
      creditCardExpense: [this.cloneSettings.export_settings.workspace_general_settings.corporate_credit_card_expenses_object],
      cccExpenseState: [this.cloneSettings.export_settings.expense_group_settings.ccc_expense_state]
    });
    this.cloneSettingsForm.markAllAsTouched();
    this.isLoading = false;
  }

  private setupPage(): void {
    forkJoin([
      this.cloneSettingService.getCloneSettings(),
    ]).subscribe(responses => {
      this.cloneSettings = responses[0];
      this.reimbursableExpenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.reimbursableExportOptions = this.getReimbursableExportTypes(EmployeeFieldMapping.EMPLOYEE);
      this.cccExpenseExportOptions = this.exportSettingService.getcreditCardExportTypes();
      this.setupForm();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }


}
