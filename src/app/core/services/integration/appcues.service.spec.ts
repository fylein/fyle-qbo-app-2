import { TestBed } from '@angular/core/testing';

import { AppcuesService } from './appcues.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { user } from 'src/app/integration/main/dashboard/dashboard.fixture';
import { UserService } from '../misc/user.service';

describe('AppcuesService', () => {
  let service: AppcuesService;

  beforeEach(() => {
    const service2 = {
      getUserProfile: () => of(user)
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppcuesService,
        { provide: UserService, useValue: service2 }
      ]
    });
    service = TestBed.inject(AppcuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get function check', () => {
    expect(service.appcues).toBeUndefined();
  });

  it('initialiseAppcues function check', () => {
    expect(service.initialiseAppcues()).toBeUndefined();
  });
});
