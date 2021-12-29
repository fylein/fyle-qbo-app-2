import { TestBed } from '@angular/core/testing';

import { AdvancedSettingService } from './advanced-setting.service';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
