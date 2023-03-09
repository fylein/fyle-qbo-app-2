import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingModel } from 'src/app/core/models/configuration/advanced-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployee, ConfigurationCtaText, CorporateCreditCardExpensesObject, CustomOperatorOption, EmployeeFieldMapping, JoinOptions, OnboardingState, OnboardingStep, PaymentSyncDirection, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';
import { WindowService } from 'src/app/core/services/core/window.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { AddEmailDialogComponent } from './add-email-dialog/add-email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from 'src/app/core/models/db/workspace-schedule.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SkipExport, ConditionField, ExpenseFilterResponse, constructPayload1, constructPayload2 } from 'src/app/core/models/misc/skip-export.model';

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  advancedSettings: AdvancedSettingGet;

  workspaceGeneralSettings: WorkspaceGeneralSetting;

  billPaymentAccounts: DestinationAttribute[];

  advancedSettingsForm: FormGroup;

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  memoStructure: string[] = [];

  memoPreviewText: string = '';

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'None',
      value: null
    },
    {
      label: 'Export Fyle ACH Payments to QuickBooks Online',
      value: PaymentSyncDirection.FYLE_TO_QBO
    },
    {
      label: 'Import QuickBooks Online Payments into Fyle',
      value: PaymentSyncDirection.QBO_TO_FYLE
    }
  ];

  frequencyIntervals: AdvancedSettingFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
      value: day + 1
    };
  });

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  scheduleSetting: WorkspaceSchedule;

  adminEmails: WorkspaceScheduleEmailOptions[];

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  // Skip Export
  showExpenseFilters: boolean;

  skippedCondition1: string;

  skippedCondition2: string;

  isDisabledChip1: boolean = false;

  isDisabledChip2: boolean = false;

  skipExportForm: FormGroup;

  showAdditionalCondition: boolean = false;

  showAddButton: boolean = true;

  workspaceId: number;

  conditionFieldOptions: ConditionField[];

  operatorFieldOptions1: { label: string; value: string }[];

  operatorFieldOptions2: { label: string; value: string }[];

  joinByOptions = [JoinOptions.AND, JoinOptions.OR];

  getSkipExportSubLabel(): string {
    const subLabel = 'You could choose to skip the export of certain expenses from Fyle to QBO by setting up a conditional rule.';
    const linkText = 'Read more';
    const linkUrl = 'https://help.fylehq.com/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online';

    return `${subLabel} <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="read-more-link"><span>${linkText}</span></a>`;
  }

  constructor(
    private advancedSettingService: AdvancedSettingService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  customOperatorOptions = [
    {
      label: 'Is',
      value: CustomOperatorOption.Is
    },
    {
      label: 'Is empty',
      value: CustomOperatorOption.IsEmpty
    },
    {
      label: 'Is not empty',
      value: CustomOperatorOption.IsNotEmpty
    }
  ];

  customSelectOperatorOptions = [
    {
      label: 'Is',
      value: 'iexact'
    },
    {
      label: 'Is not',
      value: 'not_in'
    }
  ];

  valueOption1: any[] = [];

  valueOption2: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  private createPaymentSyncWatcher(): void {
    this.advancedSettingsForm.controls.paymentSync.valueChanges.subscribe((ispaymentSyncSelected) => {
      if (ispaymentSyncSelected && ispaymentSyncSelected === PaymentSyncDirection.FYLE_TO_QBO) {
        this.advancedSettingsForm.controls.billPaymentAccount.setValidators(Validators.required);
      } else {
        this.advancedSettingsForm.controls.billPaymentAccount.clearValidators();
        this.advancedSettingsForm.controls.billPaymentAccount.setValue(null);
      }
    });
  }

  private createScheduledWatcher(): void {
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected) => {
      if (isScheduledSelected) {
        this.advancedSettingsForm.controls.exportScheduleFrequency.setValidators(Validators.required);
      } else {
        this.advancedSettingsForm.controls.exportScheduleFrequency.clearValidators();
        this.advancedSettingsForm.controls.exportScheduleFrequency.setValue(null);
      }
    });
  }

  private createMemoStructureWatcher(): void {
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  private skipExportWatcher(): void {
    this.advancedSettingsForm.controls.skipExport.valueChanges.subscribe((skipExportToggle) => {
      if (skipExportToggle) {
        this.skipExportForm.controls.condition1.setValidators(Validators.required);
        this.skipExportForm.controls.operator1.setValidators(Validators.required);
        this.skipExportForm.controls.value1.setValidators(Validators.required);
      } else {
        this.skipExportForm.reset();
        this.skipExportForm.controls.condition1.clearValidators();
        this.skipExportForm.controls.operator1.clearValidators();
        this.skipExportForm.controls.condition1.setValue(null);
        this.skipExportForm.controls.operator1.setValue(null);
        this.skipExportForm.controls.value1.clearValidators();
        this.skipExportForm.controls.value1.setValue(null);
        this.skipExportForm.controls.join_by.clearValidators();
        this.skipExportForm.controls.join_by.setValue(null);
        this.skipExportForm.controls.condition2.clearValidators();
        this.skipExportForm.controls.operator2.clearValidators();
        this.skipExportForm.controls.condition2.setValue(null);
        this.skipExportForm.controls.operator2.setValue(null);
        this.skipExportForm.controls.value2.clearValidators();
        this.skipExportForm.controls.value2.setValue(null);
        this.showAdditionalCondition = false;
        this.showAddButton = true;
      }
    });
  }

  private setCustomValidators(): void {
    this.createPaymentSyncWatcher();
    this.createScheduledWatcher();
    this.createMemoStructureWatcher();
    this.skipExportWatcher();
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

  showPaymentSyncField(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === ReimbursableExpensesObject.BILL;
  }

  showSingleCreditLineJEField(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === ReimbursableExpensesObject.JOURNAL_ENTRY || this.workspaceGeneralSettings.corporate_credit_card_expenses_object === CorporateCreditCardExpensesObject.JOURNAL_ENTRY;
  }

  showAutoCreateVendorsField(): boolean {
    return this.workspaceGeneralSettings.employee_field_mapping === EmployeeFieldMapping.VENDOR && this.workspaceGeneralSettings.auto_map_employees !== null && this.workspaceGeneralSettings.auto_map_employees !== AutoMapEmployee.EMPLOYEE_CODE;
  }

  showAutoCreateMerchantsAsVendorsField(): boolean {
    return !this.workspaceGeneralSettings.import_vendors_as_merchants && (this.workspaceGeneralSettings.corporate_credit_card_expenses_object === CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.workspaceGeneralSettings.corporate_credit_card_expenses_object === CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
  }

  private setupForm(): void {
    let paymentSync = '';
    if (this.advancedSettings.workspace_general_settings.sync_fyle_to_qbo_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_QBO;
    } else if (this.advancedSettings.workspace_general_settings.sync_qbo_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.QBO_TO_FYLE;
    }

    this.memoStructure = this.advancedSettings.workspace_general_settings.memo_structure;

    this.advancedSettingsForm = this.formBuilder.group({
      paymentSync: [paymentSync],
      billPaymentAccount: [this.advancedSettings.general_mappings.bill_payment_account?.id ? this.advancedSettings.general_mappings.bill_payment_account : null],
      changeAccountingPeriod: [this.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [this.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [this.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantsAsVendors: [this.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors],
      exportSchedule: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [this.advancedSettings.workspace_general_settings.memo_structure],
      skipExport: [this.showExpenseFilters],
      searchOption: [],
      emails: [this.advancedSettings.workspace_schedules?.emails_selected ? this.advancedSettings.workspace_schedules?.emails_selected : []],
      addedEmail: []
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  private setConditionFields(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    response.results.forEach((element) => {
      const type = this.conditionFieldOptions.filter( (fieldOption) => fieldOption.field_name === element.condition);
      const selectedConditionOption : ConditionField = type[0];
      conditionArray.push(selectedConditionOption);
    });
  }

  private setOperatorFieldOptions(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    if (conditionArray.length) {
      if (response.results[0].is_custom) {
        this.setCustomOperatorOptions(response.results[0].rank, response.results[0].custom_field_type);
      } else {
        this.operatorFieldOptions1 = this.setDefaultOperatorOptions(response.results[0].condition);
      }
      if (response.results[0].join_by !== null) {
        if (response.results[1].is_custom) {
          this.setCustomOperatorOptions(response.results[1].rank, response.results[1].custom_field_type);
        } else {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(response.results[1].condition);
        }
      }
    }
  }

  private setSkippedConditions(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    if (response.count > 0) {
      this.skippedCondition1 = conditionArray[0].field_name;
      if (response.count > 1 && response.results[0].join_by) {
        this.skippedCondition2 = conditionArray[1].field_name;
      } else {
        this.skippedCondition2 = '';
      }
    } else {
      this.skippedCondition1 = '';
      this.skippedCondition2 = '';
    }
  }

  getSelectedOperator(operator: string, value: any, condition: ConditionField) {
    switch (operator) {
      case 'isnull': {
        return value === 'True' ? 'is_empty' : 'is_not_empty';
      }
      case 'in':
        return 'iexact';
      case 'iexact': return operator;
      default: return operator;
    }
  }

  getFieldValue(value: any, condition: ConditionField, rank: number) {
    if (condition.type === 'DATE') {
      return new Date(value[0]);
    } else if (condition.field_name === 'report_title') {
      return value[0];
    }
      if (rank === 1) {
        this.valueOption1 = value;
      } else if (rank === 2) {
        this.valueOption2 = value;
      }
        return '';

  }

  setupSkipExportForm(response: ExpenseFilterResponse, conditionArray: ConditionField[]) {
    this.showExpenseFilters = response.count > 0;
    this.setConditionFields(response, conditionArray);
    this.setOperatorFieldOptions(response, conditionArray);
    this.setSkippedConditions(response, conditionArray);
    let [selectedOperator1, valueFC1, customFieldTypeFC1] = ['', '', ''];
    let [selectedOperator2, valueFC2] = ['', ''];
    let joinByFC = '';

    response.results.forEach((result, index) => {
      if (index === 0) {
        selectedOperator1 = this.getSelectedOperator(result.operator, result.values[0], conditionArray[0]);
        if (!(selectedOperator1 === 'is_empty' || selectedOperator1 === 'is_not_empty')) {
          valueFC1 = this.getFieldValue(result.values, conditionArray[0], result.rank);
        } else {
          this.isDisabledChip1 = true;
        }
        customFieldTypeFC1 = result.custom_field_type;
      } else if (index === 1 && response.results[0].join_by !== null) {
        selectedOperator2 = this.getSelectedOperator(result.operator, result.values[0], conditionArray[1]);
        joinByFC = response.results[0].join_by;
        if (!(selectedOperator2 === 'is_empty' || selectedOperator2 === 'is_not_empty')) {
          valueFC2 = this.getFieldValue(result.values, conditionArray[1], result.rank);
        } else {
          this.isDisabledChip2 = true;
        }
      }
    });

    this.skipExportForm = this.formBuilder.group({
      condition1: [conditionArray.length > 0 ? conditionArray[0] : ''],
      operator1: [selectedOperator1],
      value1: [valueFC1],
      customFieldType1: [customFieldTypeFC1],
      join_by: [joinByFC],
      condition2: [joinByFC ? conditionArray[1] : ''],
      operator2: [joinByFC && selectedOperator2 ? selectedOperator2 : ''],
      value2: [valueFC2],
      customFieldType2: joinByFC ? [response.results[1].custom_field_type] : ['']
    });

    if (response.count) {
      this.skipExportForm.controls.condition1.setValidators(Validators.required);
      this.skipExportForm.controls.operator1.setValidators(Validators.required);
      if (!this.valueOption1.length && !(selectedOperator1 === 'is_empty' || selectedOperator1 === 'is_not_empty')) {
        this.skipExportForm.controls.value1.setValidators(Validators.required);
      }
      if (response.count === 2) {
        this.showAdditionalCondition = true;
        this.showAddButton = false;
        this.skipExportForm.controls.condition2.setValidators(Validators.required);
        this.skipExportForm.controls.operator2.setValidators(Validators.required);
        this.skipExportForm.controls.join_by.setValidators(Validators.required);
        if (!this.valueOption2.length && !(selectedOperator2 === 'is_empty' || selectedOperator2 === 'is_not_empty')) {
          this.skipExportForm.controls.value2.setValidators(Validators.required);
        }
      }
    }

    this.fieldWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getQBODestinationAttributes('BANK_ACCOUNT'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.advancedSettingService.getWorkspaceAdmins(),
      this.mappingService.getFyleCustomFields(),
      this.advancedSettingService.getExpenseFilter()

    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      this.adminEmails = this.advancedSettings.workspace_schedules?.additional_email_options ? this.advancedSettings.workspace_schedules?.additional_email_options.concat(response[3]) : response[3];

      this.conditionFieldOptions = response[4];
      this.setupSkipExportForm(response[5], []);

      this.isLoading = false;

      this.setupForm();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.defaultMemoFields, event.previousIndex, event.currentIndex);
    const selectedMemoFields = this.defaultMemoFields.filter(memoOption => this.advancedSettingsForm.value.memoStructure.indexOf(memoOption) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : this.defaultMemoFields;
    this.memoStructure = memoStructure;
    this.formatMemoPreview();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/import_settings`]);
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.ADVANCED_SETTINGS, { phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState });
  }

  save(): void {
    if (this.advancedSettingsForm.valid && !this.saveInProgress) {
      if (this.skipExportForm.valid) {
          this.saveSkipExportFields();
      }
      const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);
      this.saveInProgress = true;

      this.advancedSettingService.postAdvancedSettings(advancedSettingPayload).subscribe((response: AdvancedSettingGet) => {
        if (this.workspaceService.getOnboardingState() === OnboardingState.ADVANCED_CONFIGURATION) {
          this.trackingService.onOnboardingStepCompletion(OnboardingStep.ADVANCED_SETTINGS, 5, advancedSettingPayload);
        } else {
          this.trackingService.onUpdateEvent(
            UpdateEvent.ADVANCED_SETTINGS,
            {
              phase: this.getPhase(),
              oldState: this.advancedSettings,
              newState: response
            }
          );
        }

        this.saveInProgress = false;
        this.snackBar.open('Advanced settings saved successfully');
        this.trackSessionTime('success');
        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(OnboardingState.COMPLETE);
          this.router.navigate([`/workspaces/onboarding/done`]);
        } else {
          this.router.navigate(['/workspaces/main/dashboard']);
        }
      }, () => {
        this.saveInProgress = false;
        this.snackBar.open('Error saving advanced settings, please try again later');
      });
    }
  }

  openAddemailDialog(): void {
    const dialogRef = this.dialog.open(AddEmailDialogComponent, {
      width: '467px',
      data: {
        workspaceId: this.workspaceGeneralSettings.workspace,
        hours: this.advancedSettingsForm.value.exportScheduleFrequency,
        schedulEnabled: this.advancedSettingsForm.value.exportSchedule,
        selectedEmails: this.advancedSettingsForm.value.emails
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.advancedSettingsForm.controls.exportScheduleFrequency.patchValue(result.hours);
        this.advancedSettingsForm.controls.emails.patchValue(result.emails_selected);
        this.advancedSettingsForm.controls.addedEmail.patchValue(result.email_added);
        this.adminEmails = this.adminEmails.concat(result.email_added);
      }
    });
  }

  add1(addEvent1: MatChipInputEvent): void {
    const input = addEvent1.input;
    const value = addEvent1.value;

    if ((value || '').trim()) {
      this.valueOption1.push(value);
      if (this.valueOption1.length) {
        this.skipExportForm.controls.value1.clearValidators();
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove1(chipValue: any): void {
    const index = this.valueOption1.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption1.splice(index, 1);
    }
    if (this.valueOption1.length===0) {
      this.skipExportForm.controls.value1.setValue('');
    this.skipExportForm.controls.value1.setValidators(Validators.required);
    this.skipExportForm.controls.value1.updateValueAndValidity();
    }
  }

  add2(addEvent2: MatChipInputEvent): void {
    const input = addEvent2.input;
    const value = addEvent2.value;

    if ((value || '').trim()) {
      this.valueOption2.push(value);
      if (this.valueOption2.length) {
        this.skipExportForm.controls.value2.clearValidators();
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove2(chipValue: any): void {
    const index = this.valueOption2.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption2.splice(index, 1);
    }
    if (this.valueOption2.length===0) {
      this.skipExportForm.controls.value2.setValue('');
      this.skipExportForm.controls.value2.setValidators(Validators.required);
      this.skipExportForm.controls.value2.updateValueAndValidity();
      }
  }

  resetAdditionalFilter() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
    this.valueOption2=[];
  }

  resetFields(operator: AbstractControl, value: AbstractControl, conditionSelected: ConditionField, rank: number) {
    operator.reset();
    value.reset();
    if (rank === 1) {
      this.valueOption1 = [];
    } else if (rank === 2) {
      this.valueOption2 = [];
    }
    if (conditionSelected !== null) {
      if (conditionSelected.is_custom === true) {
        this.setCustomOperatorOptions(rank, conditionSelected.type);
      } else if (conditionSelected.is_custom === false) {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        }
      }
    }
  }

  updateAdditionalFilterVisibility(show: boolean) {
    this.showAdditionalCondition = show;
    this.showAddButton = !show;
    if (this.showAdditionalCondition) {
      this.skipExportForm.controls.join_by.setValidators(Validators.required);
      this.skipExportForm.controls.condition2.setValidators(Validators.required);
      this.skipExportForm.controls.operator2.setValidators(Validators.required);
      if (this.valueOption2.length===0) {
        this.skipExportForm.controls.value2.setValidators(Validators.required);
      }
    }
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.resetAdditionalFilter();
    this.skipExportForm.controls.join_by.clearValidators();
    this.skipExportForm.controls.join_by.setValue(null);
    this.skipExportForm.controls.condition2.clearValidators();
    this.skipExportForm.controls.condition2.setValue(null);
    this.skipExportForm.controls.operator2.clearValidators();
    this.skipExportForm.controls.operator2.setValue(null);
    this.skipExportForm.controls.value2.clearValidators();
    this.skipExportForm.controls.value2.setValue(null);
  }

  checkValidationCondition() {
    const condition1 = this.skipExportForm.controls.condition1;
    const condition2 = this.skipExportForm.controls.condition2;
    if (this.showAdditionalCondition) {
      if (condition1.valid && condition2.valid) {
        if (condition1.value?.field_name === condition2.value?.field_name) {
            this.skipExportForm.controls.operator2.setValue(null);
            return true;
          }
      }
    }
    return false;
  }

  // For conditionally adding and removing Value fields from layout
  showValueHeader1(): boolean {
    return (this.skipExportForm.value.operator1 !== 'is_empty') && (this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showValueHeader2() {
    return (this.skipExportForm.value.operator2 !== 'is_empty') && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showInputField1() {
    return this.skipExportForm.value.condition1?.field_name === 'report_title' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showChipField1() {
    return (this.skipExportForm.value.condition1?.field_name !== 'report_title') && (!this.skipExportForm.value.condition1 || this.skipExportForm.value.condition1.type==='SELECT' || this.skipExportForm.value?.condition1?.type==='TEXT' || this.skipExportForm.value?.condition1?.type==='NUMBER') && (this.skipExportForm.value.operator1 !== 'is_empty')  && (this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showDateField1() {
    return this.skipExportForm.value?.condition1?.type==='DATE' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showInputField2() {
    return this.skipExportForm.value?.condition2?.field_name && this.skipExportForm.value?.condition2?.field_name === 'report_title'  && (this.skipExportForm.value.operator2 !== 'is_empty' || this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showChipField2(): boolean {
    return this.skipExportForm.value?.condition2?.field_name !== 'report_title' && (!this.skipExportForm.value?.condition2 || this.skipExportForm.value?.condition2?.type==='SELECT' || this.skipExportForm.value?.condition2?.type==='TEXT' || this.skipExportForm.value?.condition2?.type==='NUMBER') && (this.skipExportForm.value.operator2 !== 'is_empty')  && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  saveSkipExportFields() {
    const that = this;
    that.isLoading = true;
    const valueField = this.skipExportForm.getRawValue();
    if (this.showAddButton) {
      this.advancedSettingService
      .deleteExpenseFilter(2)
      .subscribe((skipExport1: SkipExport) => {
      });
    }
    if (!this.advancedSettingsForm.controls.skipExport.value) {
      this.advancedSettingService
      .deleteExpenseFilter(1)
      .subscribe((skipExport1: SkipExport) => {
      });
      this.advancedSettingService
      .deleteExpenseFilter(2)
      .subscribe((skipExport1: SkipExport) => {
      });
      that.isLoading = false;
    } else {
    if (valueField.condition1.field_name !== 'report_title' && valueField.operator1 === 'iexact') {
      valueField.operator1 = 'in';
    }
    if (valueField.join_by) {
      if (valueField.condition2.field_name !== 'report_title' && valueField.operator2 === 'iexact') {
        valueField.operator2 = 'in';
      }
  }
    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'is_empty') {
        valueField.value1 = ['True'];
        valueField.operator1 = 'isnull';
      } else if (valueField.operator1 === 'is_not_empty') {
        valueField.value1 = ['False'];
        valueField.operator1 = 'isnull';
      }
    }

    if (valueField.condition1.field_name === 'spent_at') {
      valueField.value1 = new Date(valueField.value1).toISOString().split('T')[0] + 'T17:00:00.000Z';
    }

    if (typeof valueField.value1 === 'string') {
      valueField.value1 = [valueField.value1];
    }
    const payload1 = constructPayload1(valueField, this.valueOption1);
    this.advancedSettingService
      .postExpenseFilter(payload1)
      .subscribe((skipExport1: SkipExport) => {
        if (valueField.condition2 && valueField.operator2) {
          if (valueField.condition2.field_name === 'spent_at') {
            valueField.value2 = new Date(valueField.value2).toISOString().split('T')[0] + 'T17:00:00.000Z';
          }

          if (valueField.condition2.is_custom === true) {
            if (valueField.operator2 === 'is_empty') {
              valueField.value2 = ['True'];
              valueField.operator2 = 'isnull';
            } else if (valueField.operator2 === 'is_not_empty') {
              valueField.value2 = ['False'];
              valueField.operator2 = 'isnull';
            }
          }

          if (typeof valueField.value2 === 'string') {
            valueField.value2 = [valueField.value2];
          }
            const payload2 = constructPayload2(valueField, this.valueOption2);
            this.advancedSettingService
              .postExpenseFilter(payload2)
              .subscribe((skipExport2: SkipExport) => {});
        }
        that.isLoading = false;
      });
    }
  }

  setDefaultOperatorOptions(conditionField: string) {
    const operatorList = [];
    if (
      conditionField === 'claim_number' ||
      conditionField === 'employee_email' ||
      conditionField === 'report_title'
    ) {
      operatorList.push({
        value: 'iexact',
        label: 'Is'
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: 'Is before'
      });
      operatorList.push({
        value: 'lte',
        label: 'Is it on or before'
      });
    }
    if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: 'contains'
      });
    }
    return operatorList;
  }

  setCustomOperatorOptions(rank: number, type: string) {
      if (type !== 'SELECT') {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.customOperatorOptions;
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.customOperatorOptions;
        }
      } else {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.customSelectOperatorOptions;
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.customSelectOperatorOptions;
        }
      }
    }

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition1.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator1,
          this.skipExportForm.controls.value1,
          conditionSelected,
          1
        );
      }
    );

    this.skipExportForm.controls.condition2.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator2,
          this.skipExportForm.controls.value2,
          conditionSelected,
          2
        );
      }
    );
  }

  operatorFieldWatcher() {
    this.skipExportForm.controls.operator1.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption1 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip1 = true;
          this.skipExportForm.controls.value1.clearValidators();
          this.skipExportForm.controls.value1.setValue(null);
        } else {
          this.isDisabledChip1 = false;
          this.skipExportForm.controls.value1.setValidators([Validators.required]);
          this.skipExportForm.controls.value1.setValue(null, {emitEvent: false});

        }
      }
    );

    this.skipExportForm.controls.operator2.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption2 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip2 = true;
          this.skipExportForm.controls.value2.clearValidators();
          this.skipExportForm.controls.value2.setValue(null);
        } else {
          this.isDisabledChip2 = false;
          this.skipExportForm.controls.value2.setValidators([Validators.required]);
          this.skipExportForm.controls.value2.setValue(null, {emitEvent: false});
        }
      }
    );
  }

  fieldWatcher() {
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
  }

  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }
    return false;
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
