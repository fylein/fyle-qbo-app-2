import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, UntypedFormGroup, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CloneSetting, CloneSettingModel } from 'src/app/core/models/configuration/clone-setting.model';
import { ExportSettingFormOption, NameInJournalEntryOptions } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { HelperService } from 'src/app/core/services/core/helper.service';
import { EmployeeFieldMapping, ReimbursableExpensesObject, ClickEvent, OnboardingStep, ProgressPhase, ExpenseGroupingFieldOption, CorporateCreditCardExpensesObject, ExportDateType, MappingDestinationField, SimpleSearchType, SimpleSearchPage, PaymentSyncDirection, QBOField, AutoMapEmployee, ExportSource  } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { Router } from '@angular/router';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExpenseFieldsFormOption } from 'src/app/core/models/configuration/import-setting.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { ExpenseField } from 'src/app/core/models/misc/expense-field.model';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { WorkspaceScheduleEmailOptions } from 'src/app/core/models/db/workspace-schedule.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';


@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isSaveInProgress: boolean = false;

  fyleExpenseFields: string[];

  cloneSettingsForm: FormGroup;

  autoMapEmployeeTypes: EmployeeSettingFormOption[] = this.employeeSettingService.getAutoMapEmployeeOptions();

  reimbursableExportOptions: ExportSettingFormOption[];

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  employeeFieldMappingOptions: EmployeeSettingFormOption[] = this.employeeSettingService.getEmployeeFieldMappingOptions();

  expenseGroupingFieldOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingFieldOptions();

  paymentSyncOptions: AdvancedSettingFormOption[] = this.advancedSettingService.getPaymentSyncOptions();

  frequencyIntervals: AdvancedSettingFormOption[] = this.advancedSettingService.getFrequencyIntervals();

  nameInJournalOptions: NameInJournalEntryOptions[] = this.exportSettingService.nameInJournalOptions();

  adminEmails: WorkspaceScheduleEmailOptions[];

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

  cccExpenseGroupingDateOptions: ExportSettingFormOption[];

  ProgressPhase = ProgressPhase;

  qboExpenseFields: ExpenseFieldsFormOption[];

  additionalQboExpenseFields: ExpenseFieldsFormOption[];

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  taxCodes: DestinationAttribute[];

  autoCreateMerchantsAsVendors: boolean;

  exportSource = ExportSource;

  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset', 'Income', 'Other Income'
  ];

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  hoveredIndex: {
    categoryImport: number,
    itemsImport: number,
    vendorsImport: number,
    expenseFieldImport: number,
    taxImport: number
  } = {
    categoryImport: -1,
    itemsImport: -1,
    vendorsImport: -1,
    expenseFieldImport: -1,
    taxImport: -1
  };

  memoStructure: string[] = [];

  memoPreviewText: string = '';

  showNameInJournalOption: boolean = false;

  constructor(
    private advancedSettingService: AdvancedSettingService,
    private exportSettingService: ExportSettingService,
    private importSettingService: ImportSettingService,
    private employeeSettingService: EmployeeSettingService,
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

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
    };

    this.memoPreviewText = '';
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        this.memoPreviewText += previewValues[field];
        if (index + 1 !== this.memoStructure.length) {
          this.memoPreviewText = this.memoPreviewText + ' - ';
        }
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.defaultMemoFields, event.previousIndex, event.currentIndex);
    const selectedMemoFields = this.defaultMemoFields.filter(memoOption => this.cloneSettingsForm.value.memoStructure.indexOf(memoOption) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : this.defaultMemoFields;
    this.memoStructure = memoStructure;
    this.formatMemoPreview();
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

  getExportType(exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject): string {
    const lowerCaseWord = exportType.toLowerCase();
    return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
  }

  generateGroupingLabel(exportSource: ExportSource): string {
    let exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject;
    if (exportSource === ExportSource.REIMBURSABLE) {
      exportType = this.cloneSettingsForm.value.reimbursableExportType;
    } else {
      exportType = this.cloneSettingsForm.value.creditCardExportType;
    }

    if (exportType === ReimbursableExpensesObject.EXPENSE) {
      return 'How should the expenses be grouped?';
    }
    return `How should the expense in ${this.getExportType(exportType)} be grouped?`;
  }

  private setCreditCardExpenseGroupingDateOptions(creditCardExportGroup: ExpenseGroupingFieldOption): void {
    if (creditCardExportGroup === ExpenseGroupingFieldOption.EXPENSE_ID) {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
        label: 'Posted Date',
        value: ExportDateType.POSTED_AT
      }]);
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
    }
  }

  showImportVendors(): boolean {
    return !this.cloneSettingsForm.value.autoCreateMerchantsAsVendors;
  }

  showImportProducts(): boolean {
    return this.cloneSettingsForm.controls.reimbursableExportType.value !== 'JOURNAL_ENTRY' && this.cloneSettingsForm.controls.creditCardExportType.value !== 'JOURNAL ENTRY';
  }

  showExpenseAccountField(): boolean {
    return this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.EXPENSE;
  }

  showBankAccountField(): boolean {
    return this.cloneSettingsForm.value.employeeMapping === EmployeeFieldMapping.EMPLOYEE && this.cloneSettingsForm.controls.reimbursableExportType.value && this.cloneSettingsForm.controls.reimbursableExportType.value !== ReimbursableExpensesObject.EXPENSE;
  }

  showReimbursableAccountsPayableField(): boolean {
    return (this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.BILL) || (this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.JOURNAL_ENTRY && this.cloneSettingsForm.value.employeeMapping === EmployeeFieldMapping.VENDOR);
  }

  showCreditCardAccountField(): boolean {
    return this.cloneSettingsForm.controls.creditCardExportType.value && this.cloneSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.BILL && this.cloneSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
  }

  showDebitCardAccountField(): boolean {
    return this.cloneSettingsForm.controls.creditCardExportType.value && this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
  }

  showDefaultCreditCardVendorField(): boolean {
    return this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL;
  }

  showCCCAccountsPayableField(): boolean {
    return this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL;
  }

  showSingleCreditLineJEField(): boolean {
    return this.cloneSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.JOURNAL_ENTRY || this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.JOURNAL_ENTRY;
  }

  showAutoCreateVendorsField(): boolean {
    return this.cloneSettingsForm.controls.employeeMapping.value === EmployeeFieldMapping.VENDOR && this.cloneSettingsForm.controls.autoMapEmployee.value !== null && this.cloneSettingsForm.controls.autoMapEmployee.value !== AutoMapEmployee.EMPLOYEE_CODE;
  }

  showAutoCreateMerchantsAsVendorsField(): boolean {
    return !this.cloneSettingsForm.controls.importVendorsAsMerchants.value && (this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.cloneSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
  }


  private restrictExpenseGroupSetting(creditCardExportType: string | null) : void {
    if (creditCardExportType === CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || creditCardExportType === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE) {
      this.cloneSettingsForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.cloneSettingsForm.controls.creditCardExportGroup.disable();

      this.cccExpenseGroupingDateOptions = [{
          label: 'Posted Date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: 'Spend Date',
          value: ExportDateType.SPENT_AT
        }];
    } else {
      this.cloneSettingsForm.controls.creditCardExportGroup.enable();
      this.setCreditCardExpenseGroupingDateOptions(this.cloneSettingsForm.controls.creditCardExportGroup.value);
    }
  }

  private createCreditCardExportTypeWatcher(): void {
    this.restrictExpenseGroupSetting(this.cloneSettingsForm.controls.creditCardExpense.value);
    this.cloneSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportType: string) => {
      this.exportSettingService.setGeneralMappingsValidator(this.cloneSettingsForm);
      this.restrictExpenseGroupSetting(creditCardExportType);
      this.showNameInJournalOption = creditCardExportType === CorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;
    });
  }

  private createReimbursableExportTypeWatcher(): void {
    this.cloneSettingsForm.controls.reimbursableExportType.valueChanges.subscribe(() => {
      this.exportSettingService.setGeneralMappingsValidator(this.cloneSettingsForm);
    });
  }

  private createReimbursableExportGroupWatcher(): void {
    this.cloneSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroup: ExpenseGroupingFieldOption) => {
      if (reimbursableExportGroup === ExpenseGroupingFieldOption.EXPENSE_ID) {
        this.reimbursableExpenseGroupingDateOptions.pop();
      } else {
        if (this.reimbursableExpenseGroupingDateOptions.length !== 5) {
          this.reimbursableExpenseGroupingDateOptions.push({
            label: 'Last Spend Date',
            value: ExportDateType.LAST_SPENT_AT
          });
        }
      }
    });
  }

  private createCreditCardExportGroupWatcher(): void {
    this.cloneSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroup: ExpenseGroupingFieldOption) => {
      if (creditCardExportGroup && creditCardExportGroup === ExpenseGroupingFieldOption.EXPENSE_ID) {
        this.cccExpenseGroupingDateOptions = this.cccExpenseGroupingDateOptions.filter((option) => {
          return option.value !== ExportDateType.LAST_SPENT_AT;
        });
        this.setCreditCardExpenseGroupingDateOptions(creditCardExportGroup);
      } else {
        const lastSpentAt = this.cccExpenseGroupingDateOptions.filter((option) => {
          return option.value === ExportDateType.LAST_SPENT_AT;
        });
        if (!lastSpentAt.length) {
          this.cccExpenseGroupingDateOptions.push({
            label: 'Last Spend Date',
            value: ExportDateType.LAST_SPENT_AT
          });
        }
        this.setCreditCardExpenseGroupingDateOptions(creditCardExportGroup);
      }
    });
  }

  private setupExportWatchers(): void {
    this.cloneSettingsForm?.controls.reimbursableExpense?.setValidators((this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm, true)));
    this.cloneSettingsForm?.controls.creditCardExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm, true));
  }

  private setupExpenseFieldWatcher(): void {
    this.importSettingService.patchExpenseFieldEmitter.subscribe((expenseField) => {
      if (expenseField.addSourceField) {
        this.fyleExpenseFields.push(expenseField.source_field);
      }
      this.expenseFields.controls.filter(field => field.value.destination_field === expenseField.destination_field)[0].patchValue(expenseField);
    });
  }

  private setupAdditionalEmailsWatcher(): void {
    this.advancedSettingService.patchAdminEmailsEmitter.subscribe((additionalEmails) => {
      this.adminEmails = additionalEmails;
    });
  }

  private setupEmployeeMappingWatcher(): void {
    this.cloneSettingsForm.controls.employeeMapping.valueChanges.subscribe((employeeMapping: EmployeeFieldMapping) => {
      this.reimbursableExportOptions = this.exportSettingService.getReimbursableExportTypeOptions(employeeMapping);
    });
  }

  disableImportCoa(): void {
    this.cloneSettingsForm.controls.chartOfAccount.setValue(false);
  }

  disableImportItems(): void {
    this.cloneSettingsForm.controls.importItems.setValue(false);
  }

  enableItemsImport(): void {
    this.cloneSettingsForm.controls.importItems.setValue(true);
  }

  enableVendorAsMerchantImport(): void {
    this.cloneSettingsForm.controls.importVendorsAsMerchants.setValue(true);
  }

  disablVendorAsMerchantImport(): void {
    this.cloneSettingsForm.controls.importVendorsAsMerchants.setValue(false);
  }

  disableImportTax(): void {
    this.cloneSettingsForm.controls.taxCode.setValue(false);
    this.cloneSettingsForm.controls.defaultTaxCode.clearValidators();
    this.cloneSettingsForm.controls.defaultTaxCode.setValue(null);
  }

  enableTaxImport(): void {
    this.cloneSettingsForm.controls.taxCode.setValue(true);
    this.cloneSettingsForm.controls.defaultTaxCode.setValidators(Validators.required);
  }

  enableAccountImport(): void {
    this.cloneSettingsForm.controls.chartOfAccount.setValue(true);
  }

  private createMemoStructureWatcher(): void {
    this.formatMemoPreview();
    this.cloneSettingsForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  private setCustomValidatorsAndWatchers(): void {

    this.createMemoStructureWatcher();

    this.exportSettingService.createReimbursableExpenseWatcher(this.cloneSettingsForm, this.cloneSettings.export_settings);
    this.exportSettingService.createCreditCardExpenseWatcher(this.cloneSettingsForm, this.cloneSettings.export_settings);
    this.exportSettingService.setGeneralMappingsValidator(this.cloneSettingsForm);

    // Export select fields
    this.createReimbursableExportTypeWatcher();
    this.createCreditCardExportTypeWatcher();

    // Grouping fields
    this.createReimbursableExportGroupWatcher();
    this.createCreditCardExportGroupWatcher();

    this.setupExportWatchers();
    this.setupEmployeeMappingWatcher();

    this.setCreditCardExpenseGroupingDateOptions(this.cloneSettingsForm.controls.creditCardExportGroup.value);
    this.setupExpenseFieldWatcher();

    this.setupAdditionalEmailsWatcher();
  }

  createChartOfAccountField(type: string): UntypedFormGroup {
    return this.formBuilder.group({
      enabled: [this.cloneSettings.import_settings.workspace_general_settings.charts_of_accounts.includes(type) || type === 'Expense' ? true : false],
      name: [type]
    });
  }

  openAddemailDialog(): void {
    this.advancedSettingService.openAddemailDialog(this.cloneSettingsForm, this.adminEmails);
  }

  get chartOfAccountTypes() {
    return this.cloneSettingsForm.get('chartOfAccountTypes') as FormArray;
  }

  get expenseFields() {
    return this.cloneSettingsForm.get('expenseFields') as FormArray;
  }

  createExpenseField(destinationType: string): void {
    this.importSettingService.createExpenseField(destinationType, this.mappingSettings);
  }

  addExpenseField(field: ExpenseFieldsFormOption): void {
    this.expenseFields.push(this.formBuilder.group({
      source_field: [field.source_field, Validators.compose([RxwebValidators.unique(), Validators.required])],
      destination_field: [field.destination_field.toUpperCase()],
      disable_import_to_fyle: [field.disable_import_to_fyle],
      import_to_fyle: [field.import_to_fyle],
      source_placeholder: ['']
    }));
    this.expenseFields.markAllAsTouched();
    this.additionalQboExpenseFields = this.additionalQboExpenseFields.filter((expenseField) => expenseField.destination_field !== field.destination_field);
  }

  deleteExpenseField(index: number, expenseField: AbstractControl): void {
    this.expenseFields.removeAt(index);
    const additionalField = {
      source_field: '',
      destination_field: expenseField.value.destination_field,
      disable_import_to_fyle: false,
      import_to_fyle: false,
      source_placeholder: ''
    };
    this.additionalQboExpenseFields.push(additionalField);
  }


  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));

    const expenseFieldsFormArray = this.importSettingService.getExpenseFieldsFormArray(this.qboExpenseFields, false);

    let paymentSync = '';
    if (this.cloneSettings.advanced_configurations.workspace_general_settings.sync_fyle_to_qbo_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_QBO;
    } else if (this.cloneSettings.advanced_configurations.workspace_general_settings.sync_qbo_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.QBO_TO_FYLE;
    }

    this.memoStructure = this.cloneSettings.advanced_configurations.workspace_general_settings.memo_structure;

    this.cloneSettingsForm = this.formBuilder.group({
      // Employee Mapping
      employeeMapping: [this.cloneSettings.employee_mappings.workspace_general_settings?.employee_field_mapping, Validators.required],
      autoMapEmployee: [this.cloneSettings.employee_mappings.workspace_general_settings?.auto_map_employees],

      // Export Settings
      reimbursableExpense: [this.cloneSettings.export_settings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportDate: [this.cloneSettings.export_settings.expense_group_settings?.reimbursable_export_date_type],
      expenseState: [this.cloneSettings.export_settings.expense_group_settings?.expense_state],
      reimbursableExportGroup: [this.exportSettingService.getExportGroup(this.cloneSettings.export_settings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportType: [this.cloneSettings.export_settings.workspace_general_settings?.reimbursable_expenses_object],

      creditCardExpense: [this.cloneSettings.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportDate: [this.cloneSettings.export_settings.expense_group_settings?.ccc_export_date_type],
      cccExpenseState: [this.cloneSettings.export_settings.expense_group_settings?.ccc_expense_state],
      creditCardExportGroup: [this.exportSettingService.getExportGroup(this.cloneSettings.export_settings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
      creditCardExportType: [this.cloneSettings.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object],
      nameInJournalEntry: [this.cloneSettings.export_settings.workspace_general_settings.name_in_journal_entry],

      bankAccount: [this.cloneSettings.export_settings.general_mappings?.bank_account?.id ? this.cloneSettings.export_settings.general_mappings.bank_account : null],
      qboExpenseAccount: [this.cloneSettings.export_settings.general_mappings?.qbo_expense_account?.id ? this.cloneSettings.export_settings.general_mappings.qbo_expense_account : null],
      defaultCCCAccount: [this.cloneSettings.export_settings.general_mappings?.default_ccc_account?.id ? this.cloneSettings.export_settings.general_mappings.default_ccc_account : null],
      accountsPayable: [this.cloneSettings.export_settings.general_mappings?.accounts_payable?.id ? this.cloneSettings.export_settings.general_mappings.accounts_payable : null],
      defaultCreditCardVendor: [this.cloneSettings.export_settings.general_mappings?.default_ccc_vendor?.id ? this.cloneSettings.export_settings.general_mappings.default_ccc_vendor : null],
      defaultDebitCardAccount: [this.cloneSettings.export_settings.general_mappings?.default_debit_card_account?.id ? this.cloneSettings.export_settings.general_mappings.default_debit_card_account : null],
      searchOption: [],

      // Import Settings
      chartOfAccount: [this.cloneSettings.import_settings.workspace_general_settings.import_categories],
      importItems: [this.cloneSettings.import_settings.workspace_general_settings.import_items],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      expenseFields: this.formBuilder.array(expenseFieldsFormArray),
      taxCode: [this.cloneSettings.import_settings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [this.cloneSettings.import_settings.general_mappings?.default_tax_code?.id ? this.cloneSettings.import_settings.general_mappings.default_tax_code : null],
      importVendorsAsMerchants: [this.cloneSettings.import_settings.workspace_general_settings.import_vendors_as_merchants],

      // Advanced Settings
      paymentSync: [paymentSync],
      billPaymentAccount: [this.cloneSettings.advanced_configurations.general_mappings?.bill_payment_account],
      exportSchedule: [this.cloneSettings.advanced_configurations.workspace_schedules?.enabled ? this.cloneSettings.advanced_configurations.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.cloneSettings.advanced_configurations.workspace_schedules?.enabled ? this.cloneSettings.advanced_configurations.workspace_schedules.interval_hours : null],
      emails: [this.cloneSettings.advanced_configurations.workspace_schedules?.emails_selected ? this.cloneSettings.advanced_configurations.workspace_schedules?.emails_selected : []],
      addedEmail: [],
      changeAccountingPeriod: [this.cloneSettings.advanced_configurations.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [this.cloneSettings.advanced_configurations.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [this.cloneSettings.advanced_configurations.workspace_general_settings.auto_create_merchants_as_vendors ? this.cloneSettings.advanced_configurations.workspace_general_settings.auto_create_merchants_as_vendors : false],
      singleCreditLineJE: [this.cloneSettings.advanced_configurations.workspace_general_settings.je_single_credit_line],
      memoStructure: [this.cloneSettings.advanced_configurations.workspace_general_settings.memo_structure]

    });

    this.setCustomValidatorsAndWatchers();

    this.cloneSettingsForm.markAllAsTouched();

    this.isLoading = false;
  }

  private getQboExpenseFields(qboAttributes: string[], mappingSettings: MappingSetting[], isCloneSettings: boolean = false, fyleFields: string[] = []): ExpenseFieldsFormOption[] {
    return qboAttributes.map(attribute => {
      const mappingSetting = mappingSettings.filter((mappingSetting: MappingSetting) => {
        if (mappingSetting.destination_field.toUpperCase() === attribute) {
          if (isCloneSettings) {
            return fyleFields.includes(mappingSetting.source_field.toUpperCase()) ? mappingSetting : false;
          }
          return mappingSetting;
        }
        return false;
      });

      return {
        source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
        destination_field: attribute,
        import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
        disable_import_to_fyle: false,
        source_placeholder: ''
      };
    });
  }

  private setImportFields(fyleFields: ExpenseField[]): void {
    this.fyleExpenseFields = fyleFields.map(field => field.attribute_type);
      // Remove custom mapped Fyle options
      const customMappedFyleFields = this.mappingSettings.filter(setting => !setting.import_to_fyle).map(setting => setting.source_field);
      const customMappedQuickbooksFields = this.mappingSettings.filter(setting => !setting.import_to_fyle).map(setting => setting.destination_field);
      const importedQboFields = this.cloneSettings.import_settings.mapping_settings.filter(setting => setting.import_to_fyle).map(setting => setting.destination_field);

      if (customMappedFyleFields.length) {
        this.fyleExpenseFields = this.fyleExpenseFields.filter(field => !customMappedFyleFields.includes(field));
      }

      const qboFields = [
        {attribute_type: MappingDestinationField.CLASS, display_name: 'Class'},
        {attribute_type: MappingDestinationField.DEPARTMENT, display_name: 'Department'},
        {attribute_type: MappingDestinationField.CUSTOMER, display_name: 'Customer'}
      ];

      // Remove custom mapped Quickbooks fields
      const qboAttributes = qboFields.filter(
        field => !customMappedQuickbooksFields.includes(field.attribute_type)
      );

      this.qboExpenseFields = this.getQboExpenseFields(importedQboFields, this.cloneSettings.import_settings.mapping_settings, true, this.fyleExpenseFields);
      const allExpenseFields = this.importSettingService.getQboExpenseFields(qboAttributes, this.cloneSettings.import_settings.mapping_settings, true, this.fyleExpenseFields);

      this.additionalQboExpenseFields = allExpenseFields.filter((field) => {
        return !this.qboExpenseFields.some((qboField) => qboField.destination_field.toUpperCase() === field.destination_field.toUpperCase());
      });
  }


  private setupPage(): void {
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedQBODestinationAttributes(destinationAttributes),
      this.mappingService.getMappingSettings(),
      this.mappingService.getFyleExpenseFields(),
      this.advancedSettingService.getWorkspaceAdmins(),
      this.mappingService.getQBODestinationAttributes(QBOField.TAX_CODE)
    ]).subscribe(responses => {
      this.cloneSettings = responses[0];
      this.fyleExpenseFields = responses[3].map(field => field.attribute_type);

      this.adminEmails = this.cloneSettings.advanced_configurations.workspace_schedules?.additional_email_options ? this.cloneSettings.advanced_configurations.workspace_schedules?.additional_email_options.concat(responses[4]) : responses[4];
      this.employeeFieldMapping = this.cloneSettings.employee_mappings.workspace_general_settings.employee_field_mapping;
      this.mappingSettings = responses[2].results;

      this.autoCreateMerchantsAsVendors = responses[0].advanced_configurations.workspace_general_settings.auto_create_merchants_as_vendors;
      this.bankAccounts = responses[1].BANK_ACCOUNT;
      this.cccAccounts = responses[1].CREDIT_CARD_ACCOUNT;
      this.accountsPayables = responses[1].ACCOUNTS_PAYABLE;
      this.vendors = responses[1].VENDOR;
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);
      this.showNameInJournalOption = this.cloneSettings.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object === CorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.reimbursableExportOptions = this.exportSettingService.getReimbursableExportTypeOptions(EmployeeFieldMapping.EMPLOYEE);
      this.cccExpenseExportOptions = this.exportSettingService.getcreditCardExportTypes();

      this.reimbursableExpenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.reimbursableExportOptions = this.exportSettingService.getReimbursableExportTypeOptions(this.cloneSettings.employee_mappings.workspace_general_settings.employee_field_mapping);

      this.setImportFields(responses[3]);
      this.taxCodes = responses[5];

      this.setupForm();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
