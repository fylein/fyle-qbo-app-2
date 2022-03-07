import { TestBed } from '@angular/core/testing';

import { ExportSettingService } from './export-setting.service';

describe('ExportSettingService', () => {
  let service: ExportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
