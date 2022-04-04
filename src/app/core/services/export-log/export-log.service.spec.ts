import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';

describe('ExportLogService', () => {
  let service: ExportLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
