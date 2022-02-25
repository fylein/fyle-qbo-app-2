import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingModel } from 'src/app/core/models/advanced-setting.model';
import { DestinationAttribute } from 'src/app/core/models/destination-attribute.model';
import { PaymentSyncDirection } from 'src/app/core/models/enum.model';
import { AdvancedSettingService } from 'src/app/core/services/advanced-setting.service';
import { MappingService } from 'src/app/core/services/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;
  advancedSettings: AdvancedSettingGet;
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
  frequencyIntervals: number[] = [...Array(24).keys()].map(day => day + 1);
  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private advancedSettingService: AdvancedSettingService,
    private formBuilder: FormBuilder,
    private mappingService: MappingService,
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

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
      exportSchedule: [this.advancedSettings.workspace_schedules.enabled ? this.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.advancedSettings.workspace_schedules.enabled ? this.advancedSettings.workspace_schedules.interval_hours : null],
      memoStructure: [this.advancedSettings.workspace_general_settings.memo_structure]
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    forkJoin([
      this.advancedSettingService.getImportSettings(),
      this.mappingService.getQBODestinationAttributes('BANK_ACCOUNT')
    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];

      this.setupForm();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const that = this;
    moveItemInArray(that.defaultMemoFields, event.previousIndex, event.currentIndex);
    const selectedMemoFields = that.defaultMemoFields.filter(memoOption => this.advancedSettingsForm.value.memoStructure.indexOf(memoOption) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : that.defaultMemoFields;
    this.memoStructure = memoStructure;
    this.formatMemoPreview();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/import_settings`]);
  }

  save(): void {
    const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);
    console.log('Advanced setting payload: ', advancedSettingPayload);
    this.isLoading = true;
    this.advancedSettingService.postImportSettings(advancedSettingPayload).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/done`]);
    }, () => {
      this.isLoading = false;
      // TODO: handle error
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
