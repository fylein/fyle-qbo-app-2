import { getTestBed, TestBed } from '@angular/core/testing';

import { AppcuesService } from './appcues.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AppcuesService', () => {
  let service: AppcuesService;

  beforeEach(() => {
    let injector: TestBed;
    let httpMock: HttpTestingController;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppcuesService]
    });
    injector = getTestBed();
    service = TestBed.inject(AppcuesService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
