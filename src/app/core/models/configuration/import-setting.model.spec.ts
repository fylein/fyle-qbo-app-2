import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MappingDestinationField, MappingSourceField } from '../enum/enum.model';
import { ImportSettingModel, ImportSettingPost } from "./import-setting.model";

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
    const expence_Field = [{
      source_field: 'PROJECT',
      destination_field: 'CLASS',
      import_to_fyle: true,
      is_custom: true,
      source_placeholder: 'Fyle'
    }]
    const importSettingsForm= new FormGroup({
      chartOfAccount: new FormControl(true),
      chartOfAccountTypes: new FormControl([{enabled: true, name: 'expence'}]),
      expenseFields: new FormControl(expence_Field),
      taxCode: new FormControl(true),
      defaultTaxCode:new FormControl({id:'1',name:'Fyle'}),
      searchOption: new FormControl([])
    })
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: true,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{enabled: true, name: 'expence'}]),
        import_tax_codes: true
      },
      general_mappings: {
        default_tax_code: {id:'1',name:'Fyle'}
      },
      mapping_settings: [{
        source_field: MappingSourceField.PROJECT,
        destination_field: MappingDestinationField.CLASS,
        import_to_fyle: true,
        is_custom: false,
        source_placeholder: 'Fyle'
      }]
    };
    expect(ImportSettingModel.constructPayload(importSettingsForm)).toEqual(employeeSettingPayload);
  });
});
