import { TestBed } from '@angular/core/testing';

import { EmployeeSettingService } from './employee-setting.service';

describe('EmployeeSettingService', () => {
  let service: EmployeeSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
