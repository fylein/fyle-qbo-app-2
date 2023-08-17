import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCtaText, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, CCCExpenseState, ExportDateType, OnboardingState, OnboardingStep, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { ExportSettingGet, ExportSettingFormOption, ExportSettingModel } from 'src/app/core/models/configuration/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { WindowService } from 'src/app/core/services/core/window.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  employeeFieldMapping: EmployeeFieldMapping;

  exportSettingsForm: UntypedFormGroup;

  exportSettings: ExportSettingGet;

  bankAccounts: DestinationAttribute[];

  cccAccounts: DestinationAttribute[];

  accountsPayables: DestinationAttribute[];

  vendors: DestinationAttribute[];

  expenseAccounts: DestinationAttribute[];

  windowReference: Window;

  is_simplify_report_closure_enabled: boolean = false;

  import_items: boolean = false;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  expenseGroupingFieldOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingFieldOptions();

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: ExportSettingFormOption[];

  creditCardExportTypes: ExportSettingFormOption[] = this.exportSettingService.getcreditCardExportTypes();

  reimbursableExportTypes: ExportSettingFormOption[];

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private exportSettingService: ExportSettingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  getExportType(exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject): string {
    const lowerCaseWord = exportType.toLowerCase();

    return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
  }

  generateGroupingLabel(exportSource: 'reimbursable' | 'credit card'): string {
    let exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject;
    if (exportSource === 'reimbursable') {
      exportType = this.exportSettingsForm.value.reimbursableExportType;
    } else {
      exportType = this.exportSettingsForm.value.creditCardExportType;
    }

    if (exportType === ReimbursableExpensesObject.EXPENSE) {
      return 'How should the expenses be grouped?';
    }

    return `How should the expense in ${this.getExportType(exportType)} be grouped?`;
  }


  private restrictExpenseGroupSetting(creditCardExportType: string | null) : void {
    if (creditCardExportType === CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || creditCardExportType === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE) {
      this.exportSettingsForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingsForm.controls.creditCardExportGroup.disable();

      this.cccExpenseGroupingDateOptions = [{
          label: 'Posted Date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: 'Spend Date',
          value: ExportDateType.SPENT_AT
        }];
    } else {
      this.exportSettingsForm.controls.creditCardExportGroup.enable();
      this.setCreditCardExpenseGroupingDateOptions(this.exportSettingsForm.controls.creditCardExportGroup.value);
    }
  }

  setCreditCardExpenseGroupingDateOptions(creditCardExportGroup: ExpenseGroupingFieldOption): void {
    if (creditCardExportGroup === ExpenseGroupingFieldOption.EXPENSE_ID) {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
        label: 'Posted Date',
        value: ExportDateType.POSTED_AT
      }]);
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
    }
  }

  private createReimbursableExportTypeWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe(() => {
      this.exportSettingService.setGeneralMappingsValidator(this.exportSettingsForm);
});
  }

  private createCreditCardExportTypeWatcher(): void {
    this.restrictExpenseGroupSetting(this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object);
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportType: string) => {
      this.exportSettingService.setGeneralMappingsValidator(this.exportSettingsForm);
      this.restrictExpenseGroupSetting(creditCardExportType);
    });
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

  private createReimbursableExportGroupWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroup: ExpenseGroupingFieldOption) => {
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
    this.exportSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroup: ExpenseGroupingFieldOption) => {
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
    this.exportSettingsForm?.controls.reimbursableExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.exportSettingsForm));
    this.exportSettingsForm?.controls.creditCardExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.exportSettingsForm));
  }

  private setCustomValidatorsAndWatchers(): void {

    this.setupExportWatchers();

    // Date grouping
    this.setCreditCardExpenseGroupingDateOptions(this.exportSettingsForm.controls.creditCardExportGroup.value);

    // Toggles
    this.exportSettingService.createReimbursableExpenseWatcher(this.exportSettingsForm, this.exportSettings);
    this.exportSettingService.createCreditCardExpenseWatcher(this.exportSettingsForm, this.exportSettings);

    // Export select fields
    this.createReimbursableExportTypeWatcher();
    this.createCreditCardExportTypeWatcher();

    // Goruping fields
    this.createReimbursableExportGroupWatcher();
    this.createCreditCardExportGroupWatcher();

    this.exportSettingService.setGeneralMappingsValidator(this.exportSettingsForm);
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

      this.bankAccounts = response[1].BANK_ACCOUNT;
      this.cccAccounts = response[1].CREDIT_CARD_ACCOUNT;
      this.accountsPayables = response[1].ACCOUNTS_PAYABLE;
      this.vendors = response[1].VENDOR;
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);
      this.is_simplify_report_closure_enabled = response[2].is_simplify_report_closure_enabled;
      this.import_items = response[2].import_items;

      this.reimbursableExportTypes = this.exportSettingService.getReimbursableExportTypeOptions(this.employeeFieldMapping);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.expenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.is_simplify_report_closure_enabled);

      this.setupForm();
    });
  }

  private setupForm(): void {
    this.exportSettingsForm = this.formBuilder.group({
      expenseState: [this.exportSettings.expense_group_settings?.expense_state],
      reimbursableExpense: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportGroup: [this.exportSettingService.getExportGroup(this.exportSettings.expense_group_settings?.reimbursable_expense_group_fields)],
      reimbursableExportDate: [this.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      cccExpenseState: [this.exportSettings.expense_group_settings?.ccc_expense_state],
      creditCardExpense: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportType: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportGroup: [this.exportSettingService.getExportGroup(this.exportSettings.expense_group_settings?.corporate_credit_card_expense_group_fields)],
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
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/employee_settings`]);
  }

  private updateExportSettings(): boolean {
    return this.exportSettings.workspace_general_settings.reimbursable_expenses_object !== null || this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object !== null;
  }

  private singleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.reimbursableExportType === ReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== CorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.value.creditCardExportType === CorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private paymentsSyncAffected(): boolean {
    return this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.BILL && this.exportSettingsForm.value.reimbursableExportType  === ReimbursableExpensesObject.BILL;
  }

  private advancedSettingAffected(): boolean {
    if (this.updateExportSettings() && (this.singleItemizedJournalEntryAffected() || this.paymentsSyncAffected())) {
      return true;
    }

    return false;
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string, exportType: 'reimbursable' | 'credit card'): string {
    const configurationUpdate = `You have changed the export type of $exportType expense from <b>$existingExportType</b> to <b>$updatedExportType</b>,
    which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
    features that could help customize and automate your integration workflows.`;

    const newConfiguration = `You have <b>selected a new export type</b> for the $exportType expense, which would impact a few configurations
      in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and
      automate your integration workflows.`;

    let content = '';
    // If both are not none and it is an update case else for the new addition case
    if (updatedConfiguration !== 'None' && existingConfiguration !== 'None') {
      content = configurationUpdate.replace('$exportType', exportType).replace('$existingExportType', existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).replace('$updatedExportType', updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()));
    } else {
      content = newConfiguration.replace('$exportType', exportType);
    }

    // If any export-type has been changed to journal entry and has import_items set to true, then add the below content and return
    if ((updatedConfiguration === ReimbursableExpensesObject.JOURNAL_ENTRY) && this.import_items) {
      return `${content} <br><br>Also, Products/services previously imported as categories in Fyle will be disabled.`;
    }
    // If any export-type is not journal entry or import_items is set to false, simply return the normal constructed content
    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? this.exportSettings.workspace_general_settings.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object : 'None';
    const updatedReimbursableExportType = this.exportSettingsForm.value.reimbursableExportType ? this.exportSettingsForm.value.reimbursableExportType : 'None';
    const updatedCorporateCardExportType = this.exportSettingsForm.value.creditCardExportType ? this.exportSettingsForm.value.creditCardExportType : 'None';

    if (this.singleItemizedJournalEntryAffected()) {
      if (updatedReimbursableExportType !== existingReimbursableExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, 'credit card');
      }
    }

    if (!this.singleItemizedJournalEntryAffected() && this.paymentsSyncAffected()) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
    }

    return content;
  }

  private showConfirmationDialog(): void {
    const content = this.constructWarningMessage();

    const data: ConfirmationDialog = {
      title: 'Change in Configuration',
      contents: `${content}<br><br>Would you like to continue?`,
      primaryCtaText: 'Continue'
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

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.EXPORT_SETTINGS, {phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);

    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
      if (this.workspaceService.getOnboardingState() === OnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.EXPORT_SETTINGS, 3, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          UpdateEvent.EXPORT_SETTINGS,
          {
            phase: this.getPhase(),
            oldState: this.exportSettings,
            newState: response
          }
        );
      }

      this.saveInProgress = false;
      this.snackBar.open('Export settings saved successfully');
      this.trackSessionTime('success');
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(OnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/workspaces/onboarding/import_settings`]);
      } else if (this.advancedSettingAffected()) {
        this.router.navigate(['/workspaces/main/configuration/advanced_settings']);
      } else {
        this.mappingService.refreshMappingPages();
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

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
