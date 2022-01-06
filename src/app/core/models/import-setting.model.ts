import { FormGroup } from "@angular/forms";
import { MappingDestinationField, MappingSourceField } from "./enum.model";
import { DefaultDestinationAttribute, GeneralMapping } from "./general-mapping.model";
import { MappingSetting } from "./mapping-setting.model";
import { SelectFormOption } from "./select-form-option.model";
import { WorkspaceGeneralSetting } from "./workspace-general-setting.model";


export type ImportSettingPost = {
  workspace_general_settings: ImportSettingWorkspaceGeneralSetting,
  general_mappings: ImportSettingGeneralMapping,
  mapping_settings: ImportSettingMappingSetting[]
}

export type ImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean
}

export type ImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type ImportSettingMappingSetting = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField,
  import_to_fyle: boolean,
  is_custom: boolean
}

export type ExpenseFieldsFormOption = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField,
  import_to_fyle: boolean,
  disable_import_to_fyle: boolean
}

export type ImportSettingGet = {
  workspace_general_settings: WorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  mapping_settings: MappingSetting[]
}

export interface ImportSettingFormOption extends SelectFormOption {
  value: string;
}

function formatChartOfAccounts(chartOfAccounts: {enabled: boolean, name: string}[]): string[] {
  console.log('chartOfAccounts',chartOfAccounts)
  return chartOfAccounts.filter(chartOfAccount => chartOfAccount.enabled).map(chartOfAccount => chartOfAccount.name);
}

function formatMappingSettings(expenseFields: ExpenseFieldsFormOption[]): ImportSettingMappingSetting[] {
  const mappingSettings: ImportSettingMappingSetting[] = [];
  expenseFields.forEach((expenseField: ExpenseFieldsFormOption) => {
    if (expenseField.source_field) {     
      mappingSettings.push({
        source_field: expenseField.source_field,
        destination_field: expenseField.destination_field,
        import_to_fyle: expenseField.import_to_fyle,
        is_custom: expenseField.source_field === MappingSourceField.COST_CENTER || expenseField.source_field === MappingSourceField.PROJECT ? false : true,
      });
    }
  });

  return mappingSettings;
}


export class ImportSettingModel {
  static constructPayload(importSettingsForm: FormGroup): ImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('chartOfAccount')?.value,
        charts_of_accounts: formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value),
        import_tax_codes: importSettingsForm.get('taxCode')?.value
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? importSettingsForm.get('defaultTaxCode')?.value : emptyDestinationAttribute
      },
      mapping_settings: formatMappingSettings(importSettingsForm.get('expenseFields')?.value)
    };
    return employeeSettingPayload;
  }
}
