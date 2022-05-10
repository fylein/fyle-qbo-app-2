import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ExportableExpenseGroup } from '../../models/db/expense-group.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url
  const workspace_id = environment.tests.workspaceId
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    injector = getTestBed();
    service = injector.inject(DashboardService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExportableGroupsIds() service check', () => {
    const response:ExportableExpenseGroup = {exportable_expense_group_ids: []}
    service.getExportableGroupsIds().subscribe((value) => {
      
      expect(value).toEqual(response)
    })
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/exportable_expense_groups/`,
    });
  req.flush(response);
  })

  it('getExportErrors() service check', () => {
    service.getExportErrors().subscribe((value) => {
      expect(value).toEqual([])
    })
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/errors/?is_resolved=false`,
    });
    req.flush([]);
  })

  it('importExpenseGroups() service check', () => {
    service.importExpenseGroups().subscribe((value) => {
      expect(value).toEqual({})
    })
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/sync/`,
    });
    req.flush({});
  })

  it('exportExpenseGroups() service check', () => {
    service.exportExpenseGroups().subscribe((value) => {
      expect(value).toEqual({})
    })
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/exports/trigger/`,
    });
    req.flush({});
  })

  // it('getLastExport() service check', () => {
  //   service.getLastExport().subscribe((value) => {
  //     expect(value).toBeDefined()
  //   })
  // })

  // it('getExportErrors() service check', () => {
  //   service.getExportErrors().subscribe((value) => {
  //     expect(value).toBeDefined()
  //   })
  // })

  // it('getExportErrors() service check', () => {
  //   service.getExportErrors().subscribe((value) => {
  //     expect(value).toBeDefined()
  //   })
  // })

  // it('getTasks() service check', () => {
  //   service.getTasks().subscribe((value) => {
  //     expect(value).toBeDefined()
  //   })
  // })

});
