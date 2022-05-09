import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { JwtInterceptor } from '../../interceptors/jwt.interceptor';
import { ExportableExpenseGroup } from '../../models/db/expense-group.model';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

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
      url: `http://localhost:8002/api/workspaces/1/fyle/exportable_expense_groups/`,
    });
  req.flush(response);
  })

  it('getExportErrors() service check', () => {
    service.getExportErrors().subscribe((value) => {
      expect(value).toEqual([])
    })
    const req = httpMock.expectOne({
      method: 'GET',
      url: `http://localhost:8002/api/v2/workspaces/1/errors/?is_resolved=false`,
    });
    req.flush([]);
  })

  it('importExpenseGroups() service check', () => {
    service.importExpenseGroups().subscribe((value) => {
      expect(value).toEqual({})
    })
    const req = httpMock.expectOne({
      method: 'POST',
      url: `http://localhost:8002/api/workspaces/1/fyle/expense_groups/sync/`,
    });
    req.flush({});
  })

  it('exportExpenseGroups() service check', () => {
    service.exportExpenseGroups().subscribe((value) => {
      expect(value).toEqual({})
    })
    const req = httpMock.expectOne({
      method: 'POST',
      url: `http://localhost:8002/api/workspaces/1/exports/trigger/`,
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
