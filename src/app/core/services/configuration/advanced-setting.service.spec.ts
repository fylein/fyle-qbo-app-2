import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AdvancedSettingService } from './advanced-setting.service';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
