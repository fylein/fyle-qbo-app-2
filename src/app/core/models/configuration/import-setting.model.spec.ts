import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MappingSetting } from '../db/mapping-setting.model';
import { MappingDestinationField, MappingSourceField } from '../enum/enum.model';
import { ImportSettingModel, ImportSettingPost } from "./import-setting.model";

describe('ImportSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntypedFormGroup],
      declarations: [ ImportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ImportSettingModel[]', () => {
    const expence_Field = [{
      source_field: 'PROJECT',
      destination_field: 'CLASS',
      import_to_fyle: true,
      is_custom: true,
      source_placeholder: 'Fyle'
    }];
    const importSettingsForm= new UntypedFormGroup({
      chartOfAccount: new UntypedFormControl(true),
      chartOfAccountTypes: new UntypedFormControl([{enabled: true, name: 'expence'}]),
      expenseFields: new UntypedFormControl(expence_Field),
      taxCode: new UntypedFormControl(true),
      defaultTaxCode: new UntypedFormControl({id: '1', name: 'Fyle'}),
      searchOption: new UntypedFormControl([]),
      importVendorsAsMerchants: new UntypedFormControl(true)
    });
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: true,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{enabled: true, name: 'expence'}]),
        import_tax_codes: true,
        import_vendors_as_merchants: true
      },
      general_mappings: {
        default_tax_code: {id: '1', name: 'Fyle'}
      },
      mapping_settings: [{
        source_field: MappingSourceField.PROJECT,
        destination_field: MappingDestinationField.CLASS,
        import_to_fyle: true,
        is_custom: false,
        source_placeholder: 'Fyle'
      },
      {
        source_field: MappingSourceField.COST_CENTER,
        destination_field: MappingDestinationField.CUSTOMER,
        import_to_fyle: false,
        is_custom: false,
        source_placeholder: null
      }]
    };

    const existingMappingSettings: MappingSetting[] = [{
      id: 21,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1,
      source_field: MappingSourceField.COST_CENTER,
      destination_field: MappingDestinationField.CUSTOMER,
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
    }];

    expect(ImportSettingModel.constructPayload(importSettingsForm, existingMappingSettings)).toEqual(employeeSettingPayload);
  });
});
