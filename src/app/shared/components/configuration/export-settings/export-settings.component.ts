import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ExportSettingGet, ExportSettingFormOption, ExportSettingModel } from 'src/app/core/models/configuration/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/core/services/core/window.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  saveInProgress: boolean;
  isOnboarding: boolean = false;
  employeeFieldMapping: EmployeeFieldMapping;
  exportSettingsForm: FormGroup;
  exportSettings: ExportSettingGet;
  bankAccounts: DestinationAttribute[];
  cccAccounts: DestinationAttribute[];
  accountsPayables: DestinationAttribute[];
  vendors: DestinationAttribute[];
  expenseAccounts: DestinationAttribute[];
  windowReference: Window;
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
  expenseGroupingFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Expense Report',
      value: ExpenseGroupingFieldOption.CLAIM_NUMBER
    },
    {
      label: 'Payment',
      value: ExpenseGroupingFieldOption.SETTLEMENT_ID
    },
    {
      label: 'Expense',
      value: ExpenseGroupingFieldOption.EXPENSE_ID
    }
  ];
  expenseGroupingDateOptions: ExportSettingFormOption[] = [
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
  creditCardExportTypes: ExportSettingFormOption[] = [
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
  reimbursableExportTypes: ExportSettingFormOption[];
  @Output() isLoaded = new EventEmitter<boolean>();

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private exportSettingService: ExportSettingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

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

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportGroup.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportDate.setValue(null);
      }

      this.setGeneralMappingsValidator();
    });
  }

  private createCreditCardExpenseWatcher(): void {
    this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.exportSettingsForm.controls.creditCardExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.creditCardExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.creditCardExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.creditCardExportType.clearValidators();
        this.exportSettingsForm.controls.creditCardExportGroup.clearValidators();
        this.exportSettingsForm.controls.creditCardExportDate.clearValidators();
        this.exportSettingsForm.controls.creditCardExportType.setValue(null);
        this.exportSettingsForm.controls.creditCardExportGroup.setValue(null);
        this.exportSettingsForm.controls.creditCardExportDate.setValue(null);
      }

      this.setGeneralMappingsValidator();
    });
  }

  private restrictExpenseGroupSetting(creditCardExportType: string | null) : void {
    if (creditCardExportType === CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || creditCardExportType === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE) {
      this.exportSettingsForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingsForm.controls.creditCardExportGroup.disable();

      this.exportSettingsForm.controls.creditCardExportDate.setValue(ExportDateType.SPENT_AT);
      this.exportSettingsForm.controls.creditCardExportDate.disable();
    } else {
      this.exportSettingsForm.controls.creditCardExportGroup.enable();
      this.exportSettingsForm.controls.creditCardExportDate.enable();
    }
  }

  private createReimbursableExportTypeWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe(() => {
      this.setGeneralMappingsValidator();
    });
  }

  private createCreditCardExportTypeWatcher(): void {
    this.restrictExpenseGroupSetting(this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object);
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportType: string) => {
      this.setGeneralMappingsValidator();
      this.restrictExpenseGroupSetting(creditCardExportType);
    });
  }

  private exportSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (this.exportSettingsForm && this.exportSettingsForm.value.expenseState) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        }

        if (!forbidden) {
          control.parent?.get('expenseState')?.setErrors(null);
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }

      return {
        forbiddenOption: {
          value: control.value
        }
      }
    };
  }

  showBankAccountField(): boolean {
    return this.employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.reimbursableExportType.value && this.exportSettingsForm.controls.reimbursableExportType.value !== ReimbursableExpensesObject.EXPENSE;
  }

  showCreditCardAccountField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value && this.exportSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.BILL && this.exportSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
  }

  showDebitCardAccountField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value && this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
  }

  showDefaultCreditCardVendorField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL;
  }

  showExpenseAccountField(): boolean {
    return this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.EXPENSE;
  }

  showReimbursableAccountsPayableField(): boolean {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.BILL) || (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.JOURNAL_ENTRY && this.employeeFieldMapping === EmployeeFieldMapping.VENDOR);
  }

  showCCCAccountsPayableField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL;
  }

  getAccountsPayableLabel(): string {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.BILL || this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL) ? ReimbursableExpensesObject.BILL : ReimbursableExpensesObject.JOURNAL_ENTRY;
  }

  private setGeneralMappingsValidator(): void {
    if (this.showBankAccountField()) {
      this.exportSettingsForm.controls.bankAccount.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.bankAccount.clearValidators();
      this.exportSettingsForm.controls.bankAccount.updateValueAndValidity();
    }

    if (this.showCreditCardAccountField()) {
      this.exportSettingsForm.controls.defaultCCCAccount.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.defaultCCCAccount.clearValidators();
      this.exportSettingsForm.controls.defaultCCCAccount.updateValueAndValidity();
    }

    if (this.showDebitCardAccountField()) {
      this.exportSettingsForm.controls.defaultDebitCardAccount.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.defaultDebitCardAccount.clearValidators();
      this.exportSettingsForm.controls.defaultDebitCardAccount.updateValueAndValidity();
    }

    if (this.showReimbursableAccountsPayableField() || this.showCCCAccountsPayableField()) {
      this.exportSettingsForm.controls.accountsPayable.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.accountsPayable.clearValidators();
      this.exportSettingsForm.controls.accountsPayable.updateValueAndValidity();
    }

    if (this.showDefaultCreditCardVendorField()) {
      this.exportSettingsForm.controls.defaultCreditCardVendor.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.defaultCreditCardVendor.clearValidators();
      this.exportSettingsForm.controls.defaultCreditCardVendor.updateValueAndValidity();
    }

    if (this.showExpenseAccountField()) {
      this.exportSettingsForm.controls.qboExpenseAccount.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.qboExpenseAccount.clearValidators();
      this.exportSettingsForm.controls.qboExpenseAccount.updateValueAndValidity();
    }
  }

  private setCustomValidatorsAndWatchers(): void {
    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();

    // Export select fields
    this.createReimbursableExportTypeWatcher();
    this.createCreditCardExportTypeWatcher();

    this.setGeneralMappingsValidator();
  }

  private getExportGroup(exportGroups: string[]): string {
    const exportGroup = exportGroups.find((exportGroup) => {
      return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
    });

    return exportGroup ? exportGroup : 'expense_report';
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    forkJoin([
      this.exportSettingService.getExportSettings(),
      this.mappingService.getGroupedQBODestinationAttributes(destinationAttributes),
      this.workspaceService.getWorkspaceGeneralSettings()
    ]).subscribe(response => {
      this.exportSettings = response[0];
      this.employeeFieldMapping = response[2].employee_field_mapping;
      this.reimbursableExportTypes = this.getReimbursableExportTypes(this.employeeFieldMapping);

      this.bankAccounts = response[1].BANK_ACCOUNT;
      this.cccAccounts = response[1].CREDIT_CARD_ACCOUNT;
      this.accountsPayables = response[1].ACCOUNTS_PAYABLE;
      this.vendors = response[1].VENDOR;
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);

      this.setupForm();
    });
  }

  private setupForm(): void {
    this.exportSettingsForm = this.formBuilder.group({
      expenseState: [this.exportSettings.expense_group_settings?.expense_state, Validators.compose([Validators.required, this.exportSelectionValidator()])],
      reimbursableExpense: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false, this.exportSelectionValidator()],
      reimbursableExportType: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportGroup: [this.getExportGroup(this.exportSettings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportDate: [this.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false, this.exportSelectionValidator()],
      creditCardExportType: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportGroup: [this.getExportGroup(this.exportSettings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
      creditCardExportDate: [this.exportSettings.expense_group_settings?.ccc_export_date_type],
      bankAccount: [this.exportSettings.general_mappings?.bank_account?.id ? this.exportSettings.general_mappings.bank_account : null],
      defaultCCCAccount: [this.exportSettings.general_mappings?.default_ccc_account?.id ? this.exportSettings.general_mappings.default_ccc_account : null],
      accountsPayable: [this.exportSettings.general_mappings?.accounts_payable?.id ? this.exportSettings.general_mappings.accounts_payable : null],
      defaultCreditCardVendor: [this.exportSettings.general_mappings?.default_ccc_vendor?.id ? this.exportSettings.general_mappings.default_ccc_vendor : null],
      qboExpenseAccount: [this.exportSettings.general_mappings?.qbo_expense_account?.id ? this.exportSettings.general_mappings.qbo_expense_account : null],
      defaultDebitCardAccount: [this.exportSettings.general_mappings?.default_debit_card_account?.id ? this.exportSettings.general_mappings.default_debit_card_account : null],
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();
    this.isLoading = false;
    this.isLoaded.emit(true);
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/employee_settings`]);
  }

  private singleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.reimbursableExportType === ReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== CorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.creditCardExportType === CorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private paymentsSyncAffected(): boolean {
    return this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.BILL && this.exportSettingsForm.value.reimbursableExportType  === ReimbursableExpensesObject.BILL;
  }

  private advancedSettingAffected(): boolean {
    if (this.singleItemizedJournalEntryAffected() || this.paymentsSyncAffected()) {
      return true;
    }

    return false;
  }

  private constructWarningMessage(): string {
    let configurationUpdateList = '';
    const existingReimbursableExportType = this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? this.exportSettings.workspace_general_settings.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object : 'None';
    const updatedReimbursableExportType = this.exportSettingsForm.value.reimbursableExportType ? this.exportSettingsForm.value.reimbursableExportType : 'None';
    const updatedCorporateCardExportType = this.exportSettingsForm.value.creditCardExportType ? this.exportSettingsForm.value.creditCardExportType : 'None';

    if (this.singleItemizedJournalEntryAffected()) {
      if (updatedReimbursableExportType !== existingReimbursableExportType) {
        configurationUpdateList += `You are changing your export representation from <b>${existingReimbursableExportType.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</b> to <b>${updatedReimbursableExportType.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</b><br>`;
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        configurationUpdateList += `You are changing your export representation from <b>${existingCorporateCardExportType.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</b> to <b>${updatedCorporateCardExportType.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</b><br>`;
      }
    }

    if (!this.singleItemizedJournalEntryAffected() && this.paymentsSyncAffected()) {
      configurationUpdateList += `You are changing your export representation from <b>${existingReimbursableExportType.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</b> to <b>Bill</b><br>`;
    }

    return configurationUpdateList;
  }

  private showConfirmationDialog(): void {
    const configurationUpdateList = this.constructWarningMessage();

    const data: ConfirmationDialog = {
      title: 'Change in Configuration',
      contents: `${configurationUpdateList}This might effect other configurations<br><br>Do you wish to continue?`,
      primaryCtaText: 'Continue',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked) {
        this.constructPayloadAndSave();
      }
    });
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);

    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe(() => {
      this.saveInProgress = false;
      this.snackBar.open('Export settings saved successfully');
      if (this.isOnboarding) {
        this.router.navigate([`/workspaces/onboarding/import_settings`]);
      } else if (this.advancedSettingAffected()) {
        this.router.navigate(['/workspaces/main/configuration/advanced_settings']);
      } else {
        this.router.navigate(['/workspaces/main/dashboard']);
      }
    }, () => {
      this.saveInProgress = false;
      this.snackBar.open('Error saving export settings, please try again later');
      });
  }

  save(): void {
    if (this.exportSettingsForm.valid && !this.saveInProgress) {
      if (this.advancedSettingAffected()) {
        // Show warning dialog
        this.showConfirmationDialog();
        return;
      }
      this.constructPayloadAndSave();
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
