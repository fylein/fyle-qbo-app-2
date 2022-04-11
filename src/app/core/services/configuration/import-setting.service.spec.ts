import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ImportSettingService } from './import-setting.service';
import { ImportSettingPost, ImportSettingModel } from '../../models/configuration/import-setting.model';
import { MappingSourceField, MappingDestinationField } from '../../models/enum/enum.model';

describe('ImportSettingService', () => {
  let service: ImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEmployeeSettings service check', () => {
    expect(service.getImportSettings()).toBeTruthy()
  })

  it('postEmployeeSettings service check', () => {
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
    expect(service.postImportSettings(employeeSettingPayload)).toBeTruthy()
  })
});
