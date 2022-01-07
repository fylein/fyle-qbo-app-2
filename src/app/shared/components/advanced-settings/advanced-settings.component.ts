import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'Fyle to QBO',
      value: PaymentSyncDirection.FYLE_TO_QBO
    },
    {
      label: 'QBO to Fyle',
      value: PaymentSyncDirection.QBO_TO_FYLE
    }
  ];
  frequencyIntervals: number[] = [...Array(24).keys()].map(day => day + 1);

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

  private setCustomValidators(): void {
    this.createPaymentSyncWatcher();
  }

  private setupForm(): void {
    let paymentSync = '';
    if (this.advancedSettings.workspace_general_settings.sync_fyle_to_qbo_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_QBO;
    } else if (this.advancedSettings.workspace_general_settings.sync_qbo_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.QBO_TO_FYLE;
    }

    this.advancedSettingsForm = this.formBuilder.group({
      paymentSync: [paymentSync],
      billPaymentAccount: [this.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [this.advancedSettings.workspace_general_settings.change_accounting_period],
      singleCreditLineJE: [this.advancedSettings.workspace_general_settings.je_single_credit_line],
      autoCreateVendors: [this.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [this.advancedSettings.workspace_schedules.enabled ? this.advancedSettings.workspace_schedules.interval_hours : null]
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

  save(): void {
    console.log(this.advancedSettingsForm.value);
    const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);
    console.log('Advanced setting payload: ', advancedSettingPayload);
    this.isLoading = true;
    this.advancedSettingService.postImportSettings(advancedSettingPayload).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([`/workspaces/${this.workspaceService.getWorkspaceId()}/onboarding/done`]);
    }, () => {
      this.isLoading = false;
      // TODO: handle error
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
