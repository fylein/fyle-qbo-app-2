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
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  is_custom: boolean
}

export interface ExpenseFieldsFormOption extends ImportSettingMappingSetting {
  display_name: string;
}

export type ImportSettingGet = {
  workspace_general_settings: WorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  mapping_settings: MappingSetting[]
}

export interface ImportSettingFormOption extends SelectFormOption {
  value: string;
}


export class ImportSettingModel {
  private formatChartOfAccounts(chartOfAccounts: {enabled: boolean, name: string}[]): string[] {
    console.log('chartOfAccounts',chartOfAccounts)
    return chartOfAccounts.filter(chartOfAccount => chartOfAccount.enabled).map(chartOfAccount => chartOfAccount.name);
  }

  private formatMappingSettings(importSettingsForm: FormGroup): ImportSettingMappingSetting[] {
    const mappingSettings: ImportSettingMappingSetting[] = [];
    if (importSettingsForm.get('classMapping')?.value) {
      mappingSettings.push({
        source_field: importSettingsForm.get('classMapping')?.value.source_field,
        destination_field: MappingDestinationField.CLASS,
        import_to_fyle: importSettingsForm.get('classMapping')?.value.import_to_fyle,
        is_custom: importSettingsForm.get('classMapping')?.value.is_custom,
      });
    }

    if (importSettingsForm.get('departmentMapping')?.value) {
      mappingSettings.push({
        source_field: importSettingsForm.get('departmentMapping')?.value.source_field,
        destination_field: MappingDestinationField.DEPARTMENT,
        import_to_fyle: importSettingsForm.get('departmentMapping')?.value.import_to_fyle,
        is_custom: importSettingsForm.get('departmentMapping')?.value.is_custom,
      });
    }

    if (importSettingsForm.get('customerMapping')?.value) {
      mappingSettings.push({
        source_field: importSettingsForm.get('customerMapping')?.value.source_field,
        destination_field: MappingDestinationField.CUSTOMER,
        import_to_fyle: importSettingsForm.get('customerMapping')?.value.import_to_fyle,
        is_custom: importSettingsForm.get('customerMapping')?.value.is_custom,
      });
    }

    return mappingSettings;
  }

  constructPayload(importSettingsForm: FormGroup): ImportSettingPost {
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('chartOfAccount')?.value,
        charts_of_accounts: this.formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value),
        import_tax_codes: importSettingsForm.get('taxCode')?.value
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value
      },
      mapping_settings: this.formatMappingSettings(importSettingsForm)
    };
    return employeeSettingPayload;
  }
}
