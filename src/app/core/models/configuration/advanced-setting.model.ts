import { FormGroup } from "@angular/forms";
import { PaymentSyncDirection } from "../enum/enum.model";
import { DefaultDestinationAttribute, GeneralMapping } from "../db/general-mapping.model";
import { SelectFormOption } from "../misc/select-form-option.model";

export type AdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_qbo_payments: boolean,
  sync_qbo_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  je_single_credit_line: boolean,
  change_accounting_period: boolean,
  memo_structure: string[]
}

export type AdvancedSettingGeneralMapping = {
  bill_payment_account: DefaultDestinationAttribute
}

export type AdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number
}

export type AdvancedSettingPost = {
  workspace_general_settings: AdvancedSettingWorkspaceGeneralSetting,
  general_mappings: AdvancedSettingGeneralMapping,
  workspace_schedules: AdvancedSettingWorkspaceSchedule,
}

export type AdvancedSettingGet = {
  workspace_general_settings: AdvancedSettingWorkspaceGeneralSetting,
  general_mappings: AdvancedSettingGeneralMapping,
  workspace_schedules: AdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export interface AdvancedSettingFormOption extends SelectFormOption {
  value: PaymentSyncDirection;
}

export class AdvancedSettingModel {
  static constructPayload(advancedSettingsForm: FormGroup): AdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const advancedSettingPayload: AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.FYLE_TO_QBO ? true : false,
        sync_qbo_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.QBO_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        je_single_credit_line: advancedSettingsForm.get('singleCreditLineJE')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value
      },
      general_mappings: {
        bill_payment_account: advancedSettingsForm.get('billPaymentAccount')?.value ? advancedSettingsForm.get('billPaymentAccount')?.value : emptyDestinationAttribute
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null
      }
    };
    return advancedSettingPayload;
  }
}
