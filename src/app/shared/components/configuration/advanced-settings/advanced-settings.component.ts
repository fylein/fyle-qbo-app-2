import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingModel } from 'src/app/core/models/configuration/advanced-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployee, ConfigurationCtaText, CorporateCreditCardExpensesObject, EmployeeFieldMapping, OnboardingState, OnboardingStep, PaymentSyncDirection, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from 'src/app/core/models/enum/enum.model';
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
import {MatChipInputEvent} from '@angular/material/chips';
import { List } from 'cypress/types/lodash';
import { SkipExport } from 'src/app/core/models/misc/skip-export.model';
import { ConditionField } from 'src/app/core/models/misc/condition-field.model';

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
  tooltip: boolean = false;

  skipFilterCount: number = 0;

  skippedCondition1: string;

  skippedCondition2: string;

  isDisabledChip1: boolean = false;

  isDisabledChip2: boolean = false;

  skipExportForm: FormGroup;

  showAdditionalCondition: boolean = false;

  showAddButton: boolean = true;

  workspaceId: number;

  conditionFieldOptions: Array<{
    field_name: string;
    type: string;
    is_custom: boolean;
  }>;

  valueFieldOptions1 = [];

  valueFieldOptions2 = [];

  operatorFieldOptions1: { label: string; value: string }[];

  operatorFieldOptions2: { label: string; value: string }[];

  joinByOptions = [{ value: 'AND' }, { value: 'OR' }];

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

  visible = true;

  selectable = true;

  removable = true;

  addOnBlur = true;

  customOperatorOptions = [
    {
      label: 'Is',
      value: 'iexact'
    },
    {
      label: 'Is empty',
      value: 'is_empty'
    },
    {
      label: 'Is not empty',
      value: 'is_not_empty'
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
      if (!skipExportToggle) {
        this.resetSkipExport();
        this.skipFilterCount = 0;
        this.updateAdditionalFilterVisibility(false);
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
      skipExport: [this.skipFilterCount ? true : false],
      searchOption: [],
      emails: [this.advancedSettings.workspace_schedules?.emails_selected ? this.advancedSettings.workspace_schedules?.emails_selected : []],
      addedEmail: []
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(conditionArray: ConditionField[]): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getQBODestinationAttributes('BANK_ACCOUNT'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.advancedSettingService.getWorkspaceAdmins(),
      this.mappingService.getFyleCustomFields(),
      this.advancedSettingService.getSkipExport(this.workspaceId)

    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      this.adminEmails = this.advancedSettings.workspace_schedules?.additional_email_options ? this.advancedSettings.workspace_schedules?.additional_email_options.concat(response[3]) : response[3];

      this.skipFilterCount = response[5].count;
      this.conditionFieldOptions = response[4];
      response[5].results.forEach((element) => {
        const selectedConditionOption = {
          field_name: element.condition,
          type: '',
          is_custom: element.is_custom
        };
        const type = this.conditionFieldOptions.filter(
          (fieldOption) => fieldOption.field_name === element.condition
        )[0].type;
        selectedConditionOption.type = type;
        conditionArray.push(selectedConditionOption);
      });

      if (conditionArray.length) {
        if (response[5].results[0].is_custom) {
          this.setCustomOperatorOptions(response[5].results[0].rank, response[5].results[0].custom_field_type);
        } else {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            response[5].results[0].condition
          );
        }
        if (response[5].results[0].join_by !== null) {
          this.updateAdditionalFilterVisibility(true);
          if (response[5].results[1].is_custom) {
            this.setCustomOperatorOptions(response[5].results[1].rank, response[5].results[1].custom_field_type);
          } else {
            this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
              response[5].results[1].condition
            );
          }
        }
      }

      if (response[5].count > 0) {
      this.skippedCondition1 = conditionArray[0].field_name;
      if (response[5].count > 1 && response[5].results[0].join_by) {
        this.skippedCondition2 = conditionArray[1].field_name;
      }
    }
      let selectedOperator1 = '';
      let selectedOperator2 = '';
      let valueFC1;
      let valueFC2;
      let customFieldTypeFC1;
      let joinByFC;
      if (response[5].count > 0) {
        if (response[5].results[0].operator === 'isnull') {
          if (response[5].results[0].values[0] === 'True') {
            selectedOperator1 = 'is_empty';
          } else {
            selectedOperator1 = 'is_not_empty';
          }
        } else {
          selectedOperator1 = response[5].results[0].operator;
        }
        if (
          selectedOperator1 === 'is_empty' ||
          selectedOperator1 === 'is_not_empty'
        ) {
          this.isDisabledChip1 = true;
        } else {
          if (conditionArray[0].type === 'DATE') {
            valueFC1 = new Date(response[5].results[0].values[0]);
          } else if (conditionArray[0].field_name === 'report_title') {
            valueFC1 = response[5].results[0].values[0];
          } else {
            this.valueOption1 = response[5].results[0].values;
          }
        }
        customFieldTypeFC1 = response[5].results[0].custom_field_type;
      }
      if (response[5].count > 1) {
        if (response[5].results[1].operator === 'isnull') {
          if (response[5].results[1].values[0] === 'True') {
            selectedOperator2 = 'is_empty';
          } else {
            selectedOperator2 = 'is_not_empty';
          }
        } else {
          selectedOperator2 = response[5].results[1].operator;
        }
        if (response[5].results[0].join_by !== null) {
          if (
            selectedOperator2 === 'is_empty' ||
            selectedOperator2 === 'is_not_empty'
          ) {
            this.isDisabledChip2 = true;
          } else {
            if (conditionArray[1].type === 'DATE') {
              valueFC2 = new Date(response[5].results[1].values[0]);
            } else if (conditionArray[1].field_name === 'report_title') {
              valueFC2 = response[5].results[1].values[0];
            } else {
              this.valueOption2 = response[5].results[1].values;
            }
          }
        }
        if (response[5].results[0].join_by !== null) {
          joinByFC = response[5].results[0].join_by;
        }
      }

      if (selectedOperator1 === 'in') {
        selectedOperator1 = 'iexact';
      }
      if (selectedOperator2 === 'in') {
        selectedOperator2 = 'iexact';
      }

      this.skipExportForm = this.formBuilder.group({
        condition1: [
          conditionArray.length > 0 ? conditionArray[0] : '',
          [Validators.required]
        ],
        operator1: [
          selectedOperator1.length !== 0 ? selectedOperator1 : '',
          [Validators.required]
        ],
        value1: [valueFC1 ? valueFC1 : '', [Validators.required]],
        customFieldType1: [customFieldTypeFC1 ? customFieldTypeFC1 : ''],
        join_by: [joinByFC ? joinByFC : '', [Validators.required]],
        condition2: [joinByFC ? conditionArray[1] : '', [Validators.required]],
        operator2: [
          joinByFC && selectedOperator2 ? selectedOperator2 : '',
          [Validators.required]
        ],
        value2: [valueFC2 ? valueFC2 : '', [Validators.required]],
        customFieldType2: joinByFC
          ? [response[5].results[1].custom_field_type]
          : ['']
      });
      this.fieldWatcher();
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
    this.saveSkipExportFields();
    if (this.advancedSettingsForm.valid && !this.saveInProgress && this.skipExportForm.valid) {
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

  showTooltip() {
    this.tooltip = true;
  }

  hideTooltip() {
    this.tooltip = false;
  }

  add1(addEvent1: MatChipInputEvent): void {
    const input = addEvent1.input;
    const value = addEvent1.value;

    if ((value || '').trim()) {
      this.valueOption1.push(value);
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
  }

  add2(addEvent2: MatChipInputEvent): void {
    const input = addEvent2.input;
    const value = addEvent2.value;

    if ((value || '').trim()) {
      this.valueOption2.push(value);
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
  }

  resetAdditionalFilter() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
  }

  resetSkipExport() {
    this.skipExportForm.controls.condition1.reset();
    this.resetAdditionalFilter();
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
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.skipFilterCount = 1;
    this.resetAdditionalFilter();
  }

  checkValidationCondition() {
    const condition1 = this.skipExportForm.controls.condition1;
    const condition2 = this.skipExportForm.controls.condition2;
    if (condition1.valid && condition2.valid && this.skipFilterCount>1) {
      return condition1.value.field_name === condition2.value.field_name;
    }

    return false;
  }

  saveSkipExportFields() {
    const that = this;
    that.isLoading = true;
    const valueField = this.skipExportForm.getRawValue();
    // C if(!this.skipExportForm.get('condition1')?.valid)
    // C {
    // C   console.log('both filters deleted');
    // C   // delete call For Rank 1 and 2
    // C   this.advancedSettingService
    // C   .deleteSkipExport(that.workspaceId, ['1', '2'])
    // C   .subscribe((skipExport1: SkipExport) => {
    // C   });
    // C   that.isLoading = false;
    // C } else {
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
    const payload1 = {
      condition: valueField.condition1.field_name,
      operator: valueField.operator1,
      values:
        valueField.condition1.type === 'DATE' ||
        valueField.operator1 === 'isnull' || valueField.condition1.field_name === 'report_title'
          ? valueField.value1
          : this.valueOption1,
      rank: 1,
      join_by: valueField.join_by ? valueField.join_by : null,
      is_custom: valueField.condition1.is_custom,
      custom_field_type: valueField.condition1.is_custom
        ? valueField.condition1.type
        : null
    };
    this.advancedSettingService
      .postSkipExport(that.workspaceId, payload1)
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
          // C if (!valueField.join_by) {
          // C   //delete call for rank 2
          // C   this.advancedSettingService
          // C   .deleteSkipExport(that.workspaceId, ['2'])
          // C   .subscribe((skipExport1: SkipExport) => {
          // C     console.log('second filter deleted')
          // C   });
          // C   that.isLoading = false;
          // C } else {
            const payload2 = {
              condition: valueField.condition2.field_name,
              operator: valueField.operator2,
              values:
                valueField.condition2.type === 'DATE' ||
                valueField.operator2 === 'isnull' || valueField.condition2.field_name === 'report_title'
                  ? valueField.value2
                  : this.valueOption2,
              rank: 2,
              join_by: null,
              is_custom: valueField.condition2.is_custom,
              custom_field_type: valueField.condition2.is_custom
                ? valueField.condition2.type
                : null
            };
            this.advancedSettingService
              .postSkipExport(that.workspaceId, payload2)
              .subscribe((skipExport2: SkipExport) => {});
          // C }
        }
        that.isLoading = false;
      });
    // C }
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
        } else {
          this.isDisabledChip1 = false;
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
        } else {
          this.isDisabledChip2 = false;
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
    this.getSettingsAndSetupForm([]);
  }

}
