import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { ImportSettingService } from './import-setting.service';
import { ImportSettingPost, ImportSettingModel } from '../../models/configuration/import-setting.model';
import { MappingSourceField, MappingDestinationField } from '../../models/enum/enum.model';

describe('ImportSettingService', () => {
  let service: ImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
        JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(ImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getImportSettings service check', () => {
    expect(service.getImportSettings()).toBeTruthy();
  })

  it('getImportSettings service attribute check', () => {
    let keys: string[] = [];
    const responseKeys = ['workspace_general_settings', 'general_mappings', 'workspace_schedules','workspace_id'].sort();
    service.getImportSettings().subscribe((value) => {
      for (let key of Object.keys(value)) {
        keys.push(key);
      }
      keys = keys.sort();
      expect(keys).toEqual(responseKeys);
    })
  })

  it('postImportSettings service check', (done) => {
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: true,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{ enabled: true, name: 'expense' }]),
        import_tax_codes: true
      },
      general_mappings: {
        default_tax_code: { id: '1', name: 'Fyle' }
      },
      mapping_settings: [{
        source_field: MappingSourceField.PROJECT,
        destination_field: MappingDestinationField.CLASS,
        import_to_fyle: true,
        is_custom: false,
        source_placeholder: 'Fyle'
      }]
    };
    expect(service.postImportSettings(employeeSettingPayload)).toBeTruthy();
    done();
  })
});
