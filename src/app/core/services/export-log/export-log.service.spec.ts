import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';

describe('ExportLogService', () => {
  let service: ExportLogService;

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
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExpenseGroupSettings service', () => {
    service.getExpenseGroupSettings().subscribe(result => console.log("ew",result))
    expect(service.getExpenseGroupSettings()).toBeTruthy();
  });

  it('getExpenseGroups service', () => {
    service.getExpenseGroups('COMPLETE',10,5).subscribe(result => console.log("sw",result))
    expect(service.getExpenseGroups('COMPLETE',10,5)).toBeTruthy();
  });
});
