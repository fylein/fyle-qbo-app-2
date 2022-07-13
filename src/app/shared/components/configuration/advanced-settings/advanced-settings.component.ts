import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { WorkspaceSchedule } from 'src/app/core/models/db/schedule-setting.model';

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
      label: 'Export Fyle ACH Payments to Quickbooks Online',
      value: PaymentSyncDirection.FYLE_TO_QBO
    },
    {
      label: 'Import Quickbooks Payments into Fyle',
      value: PaymentSyncDirection.QBO_TO_FYLE
    }
  ];

  frequencyIntervals: any[] = [...Array(24).keys()].map(day => {
     return {
      label: +(day + 1) === 1 ? +(day + 1) + ' Hour' : +(day + 1) + ' Hours',
      value: day + 1
    };
  });

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  scheduleSetting: WorkspaceSchedule;

  adminEmails: any[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

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

  private setCustomValidators(): void {
    this.createPaymentSyncWatcher();
    this.createScheduledWatcher();
    this.createMemoStructureWatcher();
  }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: {[key: string]: string} = {
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
    return this.workspaceGeneralSettings.employee_field_mapping === EmployeeFieldMapping.VENDOR && this.workspaceGeneralSettings.auto_map_employees !== null && this.workspaceGeneralSettings.auto_map_employees !== AutoMapEmployee.EMPLOYEE_CODE ;
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
      billPaymentAccount: [this.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [this.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [this.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [this.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [this.advancedSettings.workspace_general_settings.memo_structure],
      searchOption: [],
      emails: [['fyle@fyle.in']]
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getQBODestinationAttributes('BANK_ACCOUNT'),
      this.workspaceService.getWorkspaceGeneralSettings()
      // This.workspaceService.getScheduleSettings(),
      // This.workspaceService.getWorkspaceAdmins()
    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      // This.scheduleSetting = response[3];
      // This.adminEmails = response[4];
      // This.scheduleSetting.additional_email_options.length > 0 ? this.scheduleSetting.additional_email_options.map(mail => this.adminEmails.push(mail)) : '';
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
    this.trackingService.trackTimeSpent(OnboardingStep.ADVANCED_SETTINGS, {phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  save(): void {
    if (this.advancedSettingsForm.valid && !this.saveInProgress) {
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
        hours: this.advancedSettingsForm.value.hours,
        schedulEnabled: this.advancedSettingsForm.value.scheduleEnabled,
        selectedEmails: this.advancedSettingsForm.value.emails
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getSettingsAndSetupForm();
    });
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
