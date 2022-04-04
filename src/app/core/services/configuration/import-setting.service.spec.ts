import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ImportSettingService } from './import-setting.service';

describe('ImportSettingService', () => {
  let service: ImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
