import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeSettingService } from './employee-setting.service';

describe('EmployeeSettingService', () => {
  let service: EmployeeSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule]
    });
    service = TestBed.inject(EmployeeSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
