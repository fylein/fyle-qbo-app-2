import { getTestBed, TestBed } from '@angular/core/testing';
import { ImportSettingService } from './import-setting.service';
import { ImportSettingPost, ImportSettingModel } from '../../models/configuration/import-setting.model';
import { MappingSourceField, MappingDestinationField } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';

describe('ImportSettingService', () => {
  let service: ImportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatLegacyDialogModule],
      providers: [ImportSettingService]
    });
    injector = getTestBed();
    service = injector.inject(ImportSettingService);
    httpMock = injector.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getImportSettings service attribute check', () => {
    const response={
      general_mappings: {default_tax_code: {name: null, id: null}},
      mapping_settings: [],
      workspace_general_settings: {charts_of_accounts: ["Expense"],
      import_categories: false,
      import_tax_codes: false,
      import_vendors_as_merchants: false},
      workspace_id: 1
    };
    service.getImportSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/import_settings/`
    });
    req.flush(response);
  });

  it('postImportSettings service check', () => {
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: true,
        import_items: true,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{ enabled: true, name: 'expense' }]),
        import_tax_codes: true,
        import_vendors_as_merchants: true
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
    const response={
      general_mappings: {default_tax_code: {name: 'fyle', id: '1'}},
      mapping_settings: [{
        source_field: MappingSourceField.PROJECT,
        destination_field: MappingDestinationField.CLASS,
        import_to_fyle: true,
        is_custom: false,
        source_placeholder: 'Fyle'
      }],
      workspace_general_settings: {charts_of_accounts: ["Expense"],
      import_categories: true,
      import_tax_codes: true,
      import_vendors_as_merchants: true},
      workspace_id: 1
    };
    service.postImportSettings(employeeSettingPayload).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/import_settings/`
    });
    req.flush(response);
  });
});
