import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/destination-attribute.model';
import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, ReimbursableExpensesObject } from 'src/app/core/models/enum.model';
import { ExportSettingGet, ExportSettingFormOption, ExportSettingModel } from 'src/app/core/models/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/export-setting.service';
import { MappingService } from 'src/app/core/services/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  exportSettingsForm: FormGroup;
  exportSettings: ExportSettingGet;
  bankAccounts: DestinationAttribute[];
  cccAccounts: DestinationAttribute[];
  accountsPayables: DestinationAttribute[];
  vendors: DestinationAttribute[];
  expenseAccounts: DestinationAttribute[];
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
      label: 'Credit Card Purchases',
      value: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    },
    {
      label: 'Journal Entry',
      value: CorporateCreditCardExpensesObject.JOURNAL_ENTRY
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
    private exportSettingService: ExportSettingService,
    private mappingService: MappingService,
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

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

  private createReimbursableExportTypeWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe(() => {
      this.setGeneralMappingsValidator();
    });
  }

  private createCreditCardExportTypeWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe(() => {
      this.setGeneralMappingsValidator();
    });
  }

  showBankAccountField(): boolean {
    return this.exportSettings.workspace_general_settings.employee_field_mapping === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.reimbursableExportType.value !== ReimbursableExpensesObject.EXPENSE;
  }

  showCreditCardAccountField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value && this.exportSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.BILL;
  }

  showDefaultCreditCardVendorField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL;
  }

  showExpenseAccountField(): boolean {
    return this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.EXPENSE;
  }

  showAccountsPayableField(): boolean {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.BILL || this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BILL) || (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettings.workspace_general_settings.employee_field_mapping === EmployeeFieldMapping.VENDOR);
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

    if (this.showAccountsPayableField()) {
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

  private setCustomValidators(): void {
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
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    forkJoin([
      this.exportSettingService.getExportSettings(),
      this.mappingService.getGroupedQBODestinationAttributes(destinationAttributes)
    ]).subscribe(response => {
      this.exportSettings = response[0];
      this.reimbursableExportTypes = this.getReimbursableExportTypes(this.exportSettings.workspace_general_settings.employee_field_mapping);

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
      expenseState: [this.exportSettings.expense_group_settings?.expense_state, Validators.required],
      reimbursableExpense: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportGroup: [this.getExportGroup(this.exportSettings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportDate: [this.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportType: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportGroup: [this.getExportGroup(this.exportSettings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
      creditCardExportDate: [this.exportSettings.expense_group_settings?.ccc_export_date_type],
      bankAccount: [this.exportSettings.general_mappings.bank_account?.id],
      defaultCCCAccount: [this.exportSettings.general_mappings.default_ccc_account?.id],
      // TODO: handle accounts payable for bill payments in advanced settings
      accountsPayable: [this.exportSettings.general_mappings.accounts_payable?.id],
      defaultCreditCardVendor: [this.exportSettings.general_mappings.default_ccc_vendor?.id],
      qboExpenseAccount: [this.exportSettings.general_mappings.qbo_expense_account?.id]
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  save(): void {
    // TODO: handle reimburse and ccc toggles off case
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);
    console.log('Export setting payload: ', exportSettingPayload);
    this.isLoading = true;
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([`/workspaces/${this.workspaceService.getWorkspaceId()}/onboarding/import_settings`]);
    }, () => {
      this.isLoading = false;
      // TODO: handle error
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
