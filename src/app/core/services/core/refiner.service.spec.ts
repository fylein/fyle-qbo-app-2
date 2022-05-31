import { TestBed } from '@angular/core/testing';

import { RefinerService } from './refiner.service';

describe('RefinerService', () => {
  let service: RefinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefinerService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
