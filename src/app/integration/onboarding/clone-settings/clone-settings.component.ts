import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CloneSetting, CloneSettingModel } from 'src/app/core/models/configuration/clone-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { HelperService } from 'src/app/core/services/core/helper.service';
import { EmployeeFieldMapping, ReimbursableExpensesObject, ClickEvent, OnboardingStep, ProgressPhase, ExpenseGroupingFieldOption  } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { Router } from '@angular/router';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';


@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isSaveInProgress: boolean = false;

  cloneSettingsForm: FormGroup;

  autoMapEmployeeTypes: EmployeeSettingFormOption[] = this.exportSettingService.getAutoMapEmployeeOptions();

  reimbursableExportOptions: ExportSettingFormOption[];

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  employeeFieldMappingOptions: EmployeeSettingFormOption[] = this.exportSettingService.getEmployeeFieldMappingOptions();

  reimbursableExpenseGroupingFieldOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingFieldOptions()

  bankAccounts: DestinationAttribute[];

  cccAccounts: DestinationAttribute[];

  accountsPayables: DestinationAttribute[];

  vendors: DestinationAttribute[];

  employeeFieldMapping: EmployeeFieldMapping;

  expenseAccounts: DestinationAttribute[];

  cloneSettings: CloneSetting;

  reimbursableExpenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  cccExpenseExportOptions: ExportSettingFormOption[];

  mappingSettings: MappingSetting[];

  ProgressPhase = ProgressPhase;

  constructor(
    private exportSettingService: ExportSettingService,
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private cloneSettingService: CloneSettingService,
    private mappingService: MappingService,
    private trackingService: TrackingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  resetConfiguraions(): void {
    const data: ConfirmationDialog = {
      title: 'Are you sure?',
      contents: `By resetting the configuration, you will be configuring each setting individually from the beginning. <br><br>
        Would you like to continue?`,
      primaryCtaText: 'Yes'
    };
    this.trackingService.onClickEvent(ClickEvent.CLONE_SETTINGS_RESET, {page: OnboardingStep.CLONE_SETTINGS});

    this.helperService.openDialogAndSetupRedirection(data, '/workspaces/onboarding/employee_settings');
  }

  navigateToPreviousStep(): void {
    this.trackingService.onClickEvent(ClickEvent.CLONE_SETTINGS_BACK, {page: OnboardingStep.CLONE_SETTINGS});
    this.router.navigate([`/workspaces/onboarding/qbo_connector`]);
  }

  save(): void {
    if (this.cloneSettingsForm.valid) {
      this.isSaveInProgress = true;
      const customMappingSettings = this.mappingSettings.filter(setting => !setting.import_to_fyle);
      const cloneSettingPayload = CloneSettingModel.constructPayload(this.cloneSettingsForm, customMappingSettings);

      this.cloneSettingService.postCloneSettings(cloneSettingPayload).subscribe((response) => {
        this.isSaveInProgress = false;
        this.snackBar.open('Cloned settings successfully');
        this.router.navigate([`/workspaces/onboarding/done`]);
      }, () => {
        this.isSaveInProgress = false;
        this.snackBar.open('Failed to clone settings');
      });
    }
  }

  getExportType(exportType: ReimbursableExpensesObject): string {
    const lowerCaseWord = exportType.toLowerCase();

    return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
  }

  showExpenseAccountField(): boolean {
    return this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.EXPENSE;
  }

  showBankAccountField(): boolean {
    return this.employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE && this.cloneSettingsForm.controls.reimbursableExportType.value && this.cloneSettingsForm.controls.reimbursableExportType.value !== ReimbursableExpensesObject.EXPENSE;
  }

  showReimbursableAccountsPayableField(): boolean {
    return (this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.BILL) || (this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.JOURNAL_ENTRY && this.employeeFieldMapping === EmployeeFieldMapping.VENDOR);
  }

  private setGeneralMappingsValidator(): void {
    if (this.showBankAccountField()) {
      this.cloneSettingsForm.controls.bankAccount.setValidators(Validators.required);
    } else {
      this.cloneSettingsForm.controls.bankAccount.clearValidators();
      this.cloneSettingsForm.controls.bankAccount.updateValueAndValidity();
    }

    if (this.showExpenseAccountField()) {
      this.cloneSettingsForm.controls.qboExpenseAccount.setValidators(Validators.required);
    } else {
      this.cloneSettingsForm.controls.qboExpenseAccount.clearValidators();
      this.cloneSettingsForm.controls.qboExpenseAccount.updateValueAndValidity();
    }

    if (this.showReimbursableAccountsPayableField()) {
      this.cloneSettingsForm.controls.accountsPayable.setValidators(Validators.required);
    } else {
      this.cloneSettingsForm.controls.accountsPayable.clearValidators();
      this.cloneSettingsForm.controls.accountsPayable.updateValueAndValidity();
    }
  }

  private setCustomValidatorsAndWatchers(): void {
    this.exportSettingService.createReimbursableExpenseWatcher(this.cloneSettingsForm, this.cloneSettings.export_settings);

    this.setGeneralMappingsValidator();
  }

  private setupForm(): void {
    this.cloneSettingsForm = this.formBuilder.group({
      // Employee Mapping
      employeeMapping: [this.cloneSettings.employee_mappings.workspace_general_settings.employee_field_mapping],
      autoMapEmployee: [this.cloneSettings.employee_mappings.workspace_general_settings.auto_map_employees],

      // Export Settings
      reimbursableExpense: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object ? true : false],
      reimbursableExportDate: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_export_date_type],
      reimbursableExpenseState: [this.cloneSettings.export_settings.expense_group_settings.expense_state],
      reimbursableExportType: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object],
      creditCardExpense: [this.cloneSettings.export_settings.workspace_general_settings.corporate_credit_card_expenses_object ? true : false],
      reimbursableExportGroup: [this.exportSettingService.getExportGroup(this.cloneSettings.export_settings.expense_group_settings?.reimbursable_expense_group_fields)],
      cccExpenseState: [this.cloneSettings.export_settings.expense_group_settings.ccc_expense_state],
      qboExpenseAccount: [this.cloneSettings.export_settings.general_mappings.qbo_expense_account],
      accountsPayable: [this.cloneSettings.export_settings.general_mappings.accounts_payable],
      bankAccount: [this.cloneSettings.export_settings.general_mappings.bank_account],
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();

    this.cloneSettingsForm.markAllAsTouched();

    this.isLoading = false;
  }

  private setupPage(): void {
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedQBODestinationAttributes(destinationAttributes),
      this.mappingService.getMappingSettings()
    ]).subscribe(responses => {
      this.cloneSettings = responses[0];
      this.employeeFieldMapping = this.cloneSettings.employee_mappings.workspace_general_settings.employee_field_mapping;
      this.mappingSettings = responses[2].results;
      this.cccExpenseExportOptions = this.exportSettingService.getcreditCardExportTypes();
      this.bankAccounts = responses[1].BANK_ACCOUNT;
      this.cccAccounts = responses[1].CREDIT_CARD_ACCOUNT;
      this.accountsPayables = responses[1].ACCOUNTS_PAYABLE;
      this.vendors = responses[1].VENDOR;
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);
      this.reimbursableExpenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.reimbursableExportOptions = this.exportSettingService.getReimbursableExportTypeOptions(EmployeeFieldMapping.EMPLOYEE);
      this.setupForm();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
