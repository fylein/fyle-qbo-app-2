import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { MinimalUser } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getUserProfile should return either a minimal user or null', () => {
    expect(service.getUserProfile()).toEqual(<MinimalUser>{} || null);
  });
});
