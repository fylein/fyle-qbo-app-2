import { TestBed } from '@angular/core/testing';
import { MinimalUser } from '../../models/db/user.model';

import { UserService } from './user.service';

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
