import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ExportSettingService } from './export-setting.service';

describe('ExportSettingService', () => {
  let service: ExportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule]
    });
    service = TestBed.inject(ExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
