import { TestBed } from '@angular/core/testing';

import { ImportSettingService } from './import-setting.service';

describe('ImportSettingService', () => {
  let service: ImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
