import { DefaultDestinationAttribute } from "./general-mapping.model";


export type AdvancedSetting = {
  workspace_general_settings: {
    sync_fyle_to_qbo_payments: boolean,
    sync_qbo_to_fyle_payments: boolean,
    auto_create_destination_entity: boolean,
    je_single_credit_line: boolean,
    change_accounting_period: boolean,
    memo_structure: string[]
  },
  general_mappings: {
    bill_payment_account: DefaultDestinationAttribute
  },
  workspace_schedules: {
    enabled: boolean,
    start_datetime: Date,
    interval_hours: number
  }
}

export class AdvancedSettingModel {
  static constructPayload() {
    return {};
  }
}
