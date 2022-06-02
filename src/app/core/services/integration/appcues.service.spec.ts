import { TestBed } from '@angular/core/testing';

import { AppcuesService } from './appcues.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AppcuesService', () => {
  let service: AppcuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppcuesService]
    });
    service = TestBed.inject(AppcuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
