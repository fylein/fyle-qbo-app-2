import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { MinimalUser } from '../../models/db/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getUserProfile should return either a minimal user or null', () => {
    let user = service.getUserProfile()
    if(user){
      expect(service.getUserProfile()).toEqual(<MinimalUser>{});
    }
    else{
      expect(service.getUserProfile()).toBeNull()
    }
  });
});
