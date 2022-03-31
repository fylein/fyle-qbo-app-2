import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


import { ExportLogService } from './export-log.service';

describe('ExportLogService', () => {
  let service: ExportLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef]
    });
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
