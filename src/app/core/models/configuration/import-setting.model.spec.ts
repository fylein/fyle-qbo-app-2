import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ImportSettingModel } from "./import-setting.model";

describe('ImportSettingModel', () => {
  let component: ImportSettingModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ ImportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ImportSettingModel[]', () => {
    let importSettingsForm= new FormGroup({
      chartOfAccount: new FormControl(['sample']),
      chartOfAccountTypes: new FormControl(['expence']),
      expenseFields: new FormControl(['expence']),
      taxCode: new FormControl(['00']),
      defaultTaxCode:new FormControl(['00']),
      searchOption: new FormControl([])
    })
    const employeeSettingPayload= {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('chartOfAccount')?.value,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value),
        import_tax_codes: importSettingsForm.get('taxCode')?.value
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value
      },
      mapping_settings: ImportSettingModel.formatMappingSettings(importSettingsForm.get('expenseFields')?.value)
    };
    expect(ImportSettingModel.constructPayload(importSettingsForm)).toEqual(employeeSettingPayload);
  });
  });